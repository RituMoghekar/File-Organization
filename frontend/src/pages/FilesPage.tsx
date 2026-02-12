import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import { getFiles } from "../services/api";
import { Search, Filter, List, Grid2x2, FileText } from "lucide-react";

type FileItem = {
  name: string;
  cluster: string;
  type: string;
  size: string;
  modified: string;
};


export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
  getFiles()
    .then((data) => {
      // Ensure it’s always an array
      setFiles(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error("Failed to fetch files:", err);
      setFiles([]);
    });
}, []);

const getClusterStyle = (cluster: string) => {
    if (cluster.includes("Research"))
      return "bg-teal-900 text-teal-300";
    if (cluster.includes("Code"))
      return "bg-purple-900 text-purple-300";
    if (cluster.includes("Design"))
      return "bg-rose-900 text-rose-300";
    return "bg-gray-800 text-gray-300";
  };

  return (
    <div className="flex h-screen bg-[#030508] text-[#dde4f5]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">

          {/* HEADER BAR */}
          <div className="flex items-center justify-between">

            <h1 className="text-3xl font-semibold">Files</h1>

            <div className="flex items-center gap-4">

              {/* SEARCH */}
              <div className="flex items-center bg-[#0c1220] border border-[#162035] rounded-xl px-4 py-2 w-80">
                <Search size={16} className="text-[#5a6a90]" />
                <input
                  placeholder="Filter files..."
                  className="bg-transparent outline-none ml-2 w-full"
                />
              </div>

              {/* FILTER ICON */}
              <button className="p-3 bg-[#0c1220] border border-[#162035] rounded-xl">
                <Filter size={18} />
              </button>

              {/* VIEW TOGGLE */}
              <div className="flex bg-[#0c1220] border border-[#162035] rounded-xl overflow-hidden">
                <button className="p-3 bg-purple-600">
                  <List size={18} />
                </button>
                <button className="p-3">
                  <Grid2x2 size={18} />
                </button>
              </div>

            </div>
          </div>

          {/* TABLE CARD */}
          <div className="bg-[#0c1220] border border-[#162035] rounded-2xl overflow-hidden">

            <table className="w-full text-sm">
              <thead className="text-[#5a6a90] bg-[#080d18]">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Cluster</th>
                  <th className="text-left p-4">Size</th>
                  <th className="text-left p-4">Modified</th>
                </tr>
              </thead>

              <tbody>
                {files.map((file, i) => (
                  <tr
                    key={file.name}
                    className="border-t border-[#162035] hover:bg-[#080d18] transition"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <FileText size={18} className="text-[#5a6a90]" />
                      {file.name}
                    </td>

                    <td className="p-4 text-[#5a6a90]">
                      {file.type}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getClusterStyle(file.cluster)}`}
                      >
                        {file.cluster}
                      </span>
                    </td>

                    <td className="p-4 text-[#5a6a90]">
                      {file.size}
                    </td>

                    <td className="p-4 text-[#5a6a90]">
                      {file.modified}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {files.length === 0 && (
              <div className="text-center py-12 text-[#5a6a90]">
                No files found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
