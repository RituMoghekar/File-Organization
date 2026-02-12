export default function BottomMetrics() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full flex gap-6 text-sm">
      <span className="text-emerald-400">19 files processed</span>
      <span className="text-violet-400">5 clusters formed</span>
      <span className="text-amber-400">~38 minutes saved</span>
    </div>
  );
}
