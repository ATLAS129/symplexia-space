export default function TaskCard({
  title,
  assignee,
  due,
}: {
  title: string;
  assignee: string;
  due: string;
}) {
  return (
    <div className="rounded-lg bg-gradient-to-b from-black/40 to-black/20 p-3 border border-white/6">
      <div className="font-medium">{title}</div>
      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/6 grid place-items-center text-xs">
            {assignee[0]}
          </div>
          {assignee}
        </div>
        <div>{due}</div>
      </div>
    </div>
  );
}
