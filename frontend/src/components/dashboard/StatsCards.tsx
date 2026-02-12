import { useEffect, useState } from "react";
import { getStats } from "../../services/api";
import { FileText, Layers, Zap, Activity } from "lucide-react";

export default function StatsCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return null;

  const cards = [
    {
      label: "Total Files",
      value: stats.totalFiles,
      icon: FileText,
    },
    {
      label: "Clusters",
      value: stats.clusters,
      icon: Layers,
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: Zap,
    },
    {
      label: "Events Today",
      value: stats.eventsToday,
      icon: Activity,
    },
  ];

  return (
    <>
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <div
            key={i}
            className="bg-[#0c1220] border border-[#162035] rounded-xl p-5 flex items-center gap-4 hover:border-[#00e5c0] transition"
          >
            <div className="p-3 rounded-lg bg-[#080d18]">
              <Icon size={20} className="text-[#00e5c0]" />
            </div>

            <div>
              <div className="text-xl font-semibold">
                {card.value}
              </div>
              <div className="text-sm text-[#5a6a90]">
                {card.label}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
