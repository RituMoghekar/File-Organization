import { create } from "zustand";
import type { GraphNode, GraphEdge, ClusterInfo, ActivityEntry } from "@/data/mockData";

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters: ClusterInfo[];
  selectedNode: GraphNode | null;
  searchResults: string[];
  highlightCluster: number | null;
  isConnected: boolean;
  activityFeed: ActivityEntry[];
  lastEvent: string | null;

  setGraph: (data: { nodes: GraphNode[]; edges: GraphEdge[]; clusters: ClusterInfo[] }) => void;
  setSelectedNode: (node: GraphNode | null) => void;
  setSearchResults: (ids: string[]) => void;
  setHighlightCluster: (id: number | null) => void;
  addActivity: (entry: ActivityEntry) => void;
  setConnected: (val: boolean) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  clusters: [],
  selectedNode: null,
  searchResults: [],
  highlightCluster: null,
  isConnected: false,
  activityFeed: [],
  lastEvent: null,

  setGraph: (data) => set({ nodes: data.nodes, edges: data.edges, clusters: data.clusters }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setSearchResults: (ids) => set({ searchResults: ids }),
  setHighlightCluster: (id) => set((s) => ({ highlightCluster: s.highlightCluster === id ? null : id })),
  addActivity: (entry) => set((s) => ({ activityFeed: [entry, ...s.activityFeed].slice(0, 50), lastEvent: entry.action })),
  setConnected: (val) => set({ isConnected: val }),
}));
