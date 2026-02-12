import { useEffect, useState } from "react";
import { getActivity } from "../../services/api";
import { connectActivitySocket } from "../../services/socket";

interface ActivityItem {
  id: string;
  name: string;
  status: string; // e.g., "Added", "Processed", "Cluster Updated"
  category: string; // e.g., "Research Papers", "Code Projects"
  timestamp: string; // ISO string from backend
}

export default function ActivityFeed() {
  const [events, setEvents] = useState<ActivityItem[]>([]);

  // Fetch initial activity from API
  useEffect(() => {
    getActivity().then((data) => {
      // Assuming API returns an array of ActivityItem objects
      setEvents(data.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    });
  }, []);

  // Connect WebSocket for live updates
  useEffect(() => {
    const ws = connectActivitySocket((data: ActivityItem) => {
      setEvents((prev) => [data, ...prev]);
    });

    return () => ws.close();
  }, []);

  // Helper to format "time ago"
  const timeAgo = (timestamp: string) => {
    const diff = (new Date().getTime() - new Date(timestamp).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="glass p-4 rounded-xl text-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold text-lg">Activity</h3>
        <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded">
          Export CSV
        </button>
      </div>

      <ul className="space-y-3">
        {events.map((e) => (
          <li
            key={e.id}
            className="flex justify-between items-center p-2 rounded hover:bg-gray-800 transition"
          >
            <div className="flex items-center space-x-3">
              {/* File/Item Icon based on type */}
              <div>
                {e.name.endsWith(".pdf") && <span className="text-green-400">📄</span>}
                {e.name.endsWith(".py") && <span className="text-yellow-400">⚡</span>}
                {e.name.endsWith(".md") && <span className="text-blue-400">📝</span>}
                {e.name.endsWith(".fig") && <span className="text-pink-400">🎨</span>}
                {e.name.endsWith(".xlsx") && <span className="text-teal-400">💰</span>}
              </div>
              <div>
                <p className="text-white font-medium">{e.name}</p>
                <p className="text-gray-400 text-xs">{e.status}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded">
                {e.category}
              </span>
              <span className="text-gray-500 text-xs mt-1">{timeAgo(e.timestamp)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
