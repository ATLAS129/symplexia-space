export default function FeatureCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white/3 p-6 backdrop-blur-sm">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-slate-300 text-sm">{desc}</p>
    </div>
  );
}
