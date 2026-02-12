import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Files", path: "/files" },
    { label: "Search", path: "/search" },
    { label: "Clusters", path: "/clusters" },
    { label: "Activity", path: "/activity" },
  ];

  return (
    <aside className="w-[260px] bg-panel border-r border-white/5 p-4 flex flex-col">
      <div className="text-2xl font-bold text-accent mb-8">SEFS</div>

      <nav className="space-y-2 text-sm">
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            className="px-4 py-2 rounded-xl hover:bg-white/5 cursor-pointer"
          >
            {item.label}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 text-xs text-textMuted">
        <div className="font-semibold text-white">SEFS Admin</div>
        admin@sefs.local
      </div>
    </aside>
  );
}
