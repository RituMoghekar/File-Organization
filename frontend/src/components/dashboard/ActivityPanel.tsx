import { useEffect, useState } from "react";
import { getActivity } from "../../services/api";

export default function ActivityPanel() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    getActivity().then(setItems);
  }, []);

  return (
    <div className="glass card">
      <h3 className="mb-2">Recent Activity</h3>
      <ul className="space-y-2 text-sm">
        {items.map((i, idx) => (
          <li key={idx}>• {i.text}</li>
        ))}
      </ul>
    </div>
  );
}
