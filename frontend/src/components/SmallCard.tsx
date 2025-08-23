export default function SmallCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl p-4 bg-white/3 border border-white/6">
      <div className="font-semibold">{title}</div>
      <div className="text-slate-400 text-sm mt-2">{subtitle}</div>
    </div>
  );
}
