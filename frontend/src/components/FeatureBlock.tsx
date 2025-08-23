export default function FeatureBlock({
  tag,
  title,
  desc,
}: {
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center justify-start gap-4 p-4 rounded-2xl bg-white/3 border border-white/6">
      <div className="min-w-16 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-sm">
        {tag}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-slate-400 text-sm">{desc}</div>
      </div>
    </div>
  );
}
