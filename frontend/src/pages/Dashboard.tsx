import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import StatsCards from "../components/dashboard/StatsCards";
import SemanticGraph from "../components/Graph/SemanticGraph";
import ClusterPanel from "../components/dashboard/ClusterPanel";
import ActivityPanel from "../components/dashboard/ActivityPanel";
import NodeDetailsPanel from "../components/dashboard/NodeDetailsPanel";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#030508] text-[#dde4f5]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">

          {/* STATS ROW */}
          <div className="grid grid-cols-4 gap-6">
            <StatsCards />
          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-12 gap-6 h-full">

            {/* GRAPH */}
            <div className="col-span-8 bg-[#0c1220] border border-[#162035] rounded-2xl p-5 relative">
              
              <div className="absolute top-4 left-4 text-sm bg-[#080d18] px-3 py-1 rounded-lg border border-[#162035]">
                Live Graph
              </div>

              <SemanticGraph />
            </div>

            {/* RIGHT PANEL */}
            <div className="col-span-4 flex flex-col gap-6">

              <NodeDetailsPanel />

              <ClusterPanel />

              <ActivityPanel />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
