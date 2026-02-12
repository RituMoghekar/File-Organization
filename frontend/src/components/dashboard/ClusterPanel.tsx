export default function ClusterPanel() {
  return (
    <div className="glass p-4 rounded-xl">
      <h3 className="mb-3 font-medium">Clusters</h3>
      <ul className="space-y-2 text-sm">
        <li className="text-emerald-400">Research Papers</li>
        <li className="text-violet-400">Code Projects</li>
        <li className="text-pink-400">Design Assets</li>
        <li className="text-amber-400">Meeting Notes</li>
      </ul>
    </div>
  );
}
