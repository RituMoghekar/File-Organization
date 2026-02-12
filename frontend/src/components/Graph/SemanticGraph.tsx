import { useEffect, useRef, useCallback, useState } from "react";
import * as d3 from "d3";
import { useGraphStore } from "@/store/graphStore";
import type { GraphNode } from "@/data/mockData";
import { CLUSTER_COLORS } from "@/data/mockData";
import { NodeTooltip } from "../Graph/NodeToolTip";

type SimNode = d3.SimulationNodeDatum & Omit<GraphNode, "x" | "y"> & { x?: number; y?: number };
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  weight: number;
}

export default function SemanticGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { nodes, edges, clusters, searchResults, highlightCluster, setSelectedNode } = useGraphStore();
  const [tooltip, setTooltip] = useState<{ node: SimNode; x: number; y: number } | null>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  const getNodeOpacity = useCallback(
    (node: SimNode) => {
      if (highlightCluster !== null && node.cluster_id !== highlightCluster) return 0.12;
      if (searchResults.length > 0 && !searchResults.includes(node.id)) return 0.12;
      return 1;
    },
    [highlightCluster, searchResults]
  );

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    // ===========================
    // Defs: glow filters
    // ===========================
    const defs = svg.append("defs");
    CLUSTER_COLORS.forEach((color, i) => {
      const filter = defs.append("filter")
        .attr("id", `glow-${i}`)
        .attr("x", "-50%").attr("y", "-50%")
        .attr("width", "200%").attr("height", "200%");
      filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
      filter.append("feFlood").attr("flood-color", color).attr("flood-opacity", "0.6").attr("result", "color");
      filter.append("feComposite").attr("in", "color").attr("in2", "blur").attr("operator", "in").attr("result", "shadow");
      const merge = filter.append("feMerge");
      merge.append("feMergeNode").attr("in", "shadow");
      merge.append("feMergeNode").attr("in", "SourceGraphic");
    });

    // Search glow
    const searchFilter = defs.append("filter")
      .attr("id", "glow-search")
      .attr("x", "-50%").attr("y", "-50%")
      .attr("width", "200%").attr("height", "200%");
    searchFilter.append("feGaussianBlur").attr("stdDeviation", "6").attr("result", "blur");
    searchFilter.append("feFlood").attr("flood-color", "#ffc552").attr("flood-opacity", "0.8").attr("result", "color");
    searchFilter.append("feComposite").attr("in", "color").attr("in2", "blur").attr("operator", "in").attr("result", "shadow");
    const sm = searchFilter.append("feMerge");
    sm.append("feMergeNode").attr("in", "shadow");
    sm.append("feMergeNode").attr("in", "SourceGraphic");

    // ===========================
    // Main group & zoom
    // ===========================
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(1.2));

    // ===========================
    // Nodes & links
    // ===========================
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n, x: n.x! * 1.5, y: n.y! * 1.5 }));
    const simLinks: SimLink[] = edges.map((e) => ({ source: e.source, target: e.target, weight: e.weight }));

    const simulation = d3.forceSimulation(simNodes)
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(80).strength(0.3))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide<SimNode>().radius((d) => getRadius(d.size_kb) + 6));

    simulationRef.current = simulation;

    // Cluster hulls
    const hullGroup = g.append("g").attr("class", "hulls");

    // Edges
    const linkGroup = g.append("g").attr("class", "links");
    const links = linkGroup.selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.08)")
      .attr("stroke-width", (d) => d.weight * 2.5)
      .attr("stroke-opacity", (d) => d.weight * 0.35);

    // Nodes
    const nodeGroup = g.append("g").attr("class", "nodes");
    const nodeElements = nodeGroup.selectAll<SVGCircleElement, SimNode>("circle")
      .data(simNodes)
      .join("circle")
      .attr("r", (d) => getRadius(d.size_kb))
      .attr("fill", (d) => clusters.find((cl) => cl.id === d.cluster_id)?.color ?? "#5a6a90")
      .attr("stroke", (d) => clusters.find((cl) => cl.id === d.cluster_id)?.color ?? "#5a6a90")
      .attr("stroke-width", 2)
      .attr("fill-opacity", 0.85)
      .attr("filter", (d) => `url(#glow-${d.cluster_id % CLUSTER_COLORS.length})`)
      .attr("cursor", "pointer")
      .attr("opacity", (d) => getNodeOpacity(d))
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(150).attr("r", getRadius(d.size_kb) * 1.3);
        const [cx, cy] = d3.pointer(event, svgRef.current);
        setTooltip({ node: d, x: cx + 12, y: cy - 12 });
      })
      .on("mouseout", function (_, d) {
        d3.select(this).transition().duration(150).attr("r", getRadius(d.size_kb));
        setTooltip(null);
      })
      .on("click", (_, d) => setSelectedNode(d));

    // Apply drag (fixed TypeScript issue)
    nodeElements.call(
      d3.drag<SVGCircleElement, SimNode>()
        .on("start", (e, d) => {
          if (!e.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on("end", (e, d) => {
          if (!e.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    // Labels
    const labelGroup = g.append("g").attr("class", "labels");
    const labels = labelGroup.selectAll<SVGTextElement, SimNode>("text")
      .data(simNodes)
      .join("text")
      .text((d) => (d.label.length > 18 ? d.label.slice(0, 16) + "…" : d.label))
      .attr("font-size", "9px")
      .attr("fill", "hsl(224, 60%, 92%)")
      .attr("fill-opacity", 0.7)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getRadius(d.size_kb) + 14)
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("pointer-events", "none")
      .attr("opacity", (d) => getNodeOpacity(d));

    // Search result rings
    if (searchResults.length > 0) {
      nodeGroup.selectAll<SVGCircleElement, SimNode>("circle.search-ring")
        .data(simNodes.filter((n) => searchResults.includes(n.id)))
        .join("circle")
        .attr("class", "search-ring")
        .attr("r", (d) => getRadius(d.size_kb) + 6)
        .attr("fill", "none")
        .attr("stroke", "#ffc552")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 2")
        .attr("filter", "url(#glow-search)")
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!);
    }

    // ===========================
    // Tick updates
    // ===========================
    simulation.on("tick", () => {
      links
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);

      nodeElements.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!);

      // Update hulls
      hullGroup.selectAll("path").remove();
      const clusterIds = [...new Set(simNodes.map((n) => n.cluster_id))];
      clusterIds.forEach((cid) => {
        const pts = simNodes.filter((n) => n.cluster_id === cid).map((n) => [n.x!, n.y!] as [number, number]);
        if (pts.length < 3) return;
        const hull = d3.polygonHull(pts);
        if (!hull) return;
        const c = clusters.find((cl) => cl.id === cid);
        const color = c?.color ?? "#5a6a90";
        const cx = d3.mean(hull, (d) => d[0])!;
        const cy = d3.mean(hull, (d) => d[1])!;
        const expanded = hull.map(([hx, hy]) => {
          const dx = hx - cx;
          const dy = hy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const scale = (dist + 30) / dist;
          return [cx + dx * scale, cy + dy * scale] as [number, number];
        });
        hullGroup.append("path")
          .attr("d", `M${expanded.map((p) => p.join(",")).join("L")}Z`)
          .attr("fill", color)
          .attr("fill-opacity", 0.04)
          .attr("stroke", color)
          .attr("stroke-opacity", 0.15)
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "6 3");
      });

      // Update search rings
      if (searchResults.length > 0) {
        nodeGroup.selectAll("circle.search-ring")
          .attr("cx", (d: any) => d.x!)
          .attr("cy", (d: any) => d.y!);
      }
    });

    return () => simulation.stop();
  }, [nodes, edges, clusters, searchResults, highlightCluster]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      {tooltip && <NodeTooltip node={tooltip.node} x={tooltip.x} y={tooltip.y} clusters={clusters} />}
    </div>
  );
}

// Radius helper
function getRadius(sizeKb: number) {
  return Math.max(8, Math.min(20, Math.log(sizeKb + 1) * 5));
}
