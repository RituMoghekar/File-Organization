// frontend/src/data/mockData.ts

export interface GraphNode {
  id: string;
  label: string;
  cluster_id: number;
  keywords: string[];
  size_kb: number;
  modified: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface ClusterInfo {
  id: number;
  label: string;
  color: string;
}

export interface ActivityEntry {
  action: string;
  timestamp: string;
}

export const CLUSTER_COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6A4C93"];

export const clusters: ClusterInfo[] = [
  { id: 0, label: "Cluster A", color: CLUSTER_COLORS[0] },
  { id: 1, label: "Cluster B", color: CLUSTER_COLORS[1] },
];

export const nodes: GraphNode[] = [
  { id: "1", label: "Node 1", cluster_id: 0, keywords: ["foo"], size_kb: 12, modified: new Date().toISOString() },
  { id: "2", label: "Node 2", cluster_id: 1, keywords: ["bar"], size_kb: 8, modified: new Date().toISOString() },
];

export const edges: GraphEdge[] = [
  { source: "1", target: "2", weight: 1 },
  { source: "2", target: "3", weight: 0.8 },
];
