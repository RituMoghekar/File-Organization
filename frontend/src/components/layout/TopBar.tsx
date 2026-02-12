import Logout from "../../pages/Logout";
import { Link } from "react-router-dom";


export default function TopBar() {
  return (
    <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between">
      <input
        className="glass px-4 py-2 rounded-xl w-[360px] text-sm outline-none"
        placeholder="Search files semantically..."
      />

      <div className="flex items-center gap-4">
        <span className="text-xs text-textMuted">Admin</span>
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          A
        </div>
        <div>
          <Link to="/logout" className="px-4 py-2">
  Logout
</Link>
        </div>
      </div>
    </div>
  );
}
