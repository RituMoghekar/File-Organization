// ClusterList.tsx
import { useEffect, useState } from "react";

interface Cluster {
  name: string;
  color: string;
  count: number;
  updated?: string;
}

// Tailwind-safe color mapping
const colorMap: Record<string, string> = {
  "emerald-400": "text-emerald-400",
  "violet-400": "text-violet-400",
  "amber-400": "text-amber-400",
  "yellow-400": "text-yellow-400",
  "gray-400": "text-gray-400",
  "sky-400": "text-sky-400",
  "pink-400": "text-pink-400",
  "rose-400": "text-rose-400",
};

export default function ClusterList() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9000/api/clusters", {
  headers: {"X-API-KEY": "hackathon-secret-key"}
})

      .then((res) => res.json())
      .then((data) => {
        setClusters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching clusters:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-white">Loading clusters...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {clusters.map((c, idx) => (
    <div key={idx} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
      <div className={`flex items-center space-x-2`}>
        <span className={`w-3 h-3 rounded-full ${colorMap[c.color]}`}></span>
        <h4 className="text-white font-semibold">{c.name}</h4>
      </div>
      <p className="text-gray-400 mt-2 text-sm">{c.count} files</p>
      <p className="text-gray-500 text-xs mt-1">Updated {c.updated}</p>
    </div>
  ))}
</div>

  );
}
