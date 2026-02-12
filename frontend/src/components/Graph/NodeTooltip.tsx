import { motion } from "framer-motion";
import type { ClusterInfo } from "@/data/mockData";

interface TooltipNode {
  label: string;
  cluster_id: number;
  keywords: string[];
  size_kb: number;
  modified: string;
}

interface Props {
  node: TooltipNode;
  x: number;
  y: number;
  clusters: ClusterInfo[];
}

export function NodeTooltip({ node, x, y, clusters }: Props) {
  const cluster = clusters.find((c) => c.id === node.cluster_id);
  const modified = new Date(node.modified).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 w-[260px] p-3 bg-card border border-border rounded-lg pointer-events-none"
      style={{ left: x, top: y }}
    >
      <p className="font-display font-bold text-sm text-foreground truncate">{node.label}</p>
      {cluster && (
        <span
          className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
          style={{ backgroundColor: cluster.color + "22", color: cluster.color }}
        >
          {cluster.label}
        </span>
      )}
      <div className="flex gap-1 mt-2 flex-wrap">
        {node.keywords.map((kw) => (
          <span key={kw} className="px-1.5 py-0.5 rounded text-[9px] bg-muted text-muted-foreground font-mono">
            {kw}
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
        <span>{node.size_kb} KB</span>
        <span>{modified}</span>
      </div>
    </motion.div>
  );
}
