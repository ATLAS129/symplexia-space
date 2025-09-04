export default function RightAside({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <aside className="hidden 2xl:flex w-1/5 border-l border-white/6 bg-gradient-to-b from-black/60 to-transparent justify-center">
      <div className="fixed p-6 w-1/5 h-full flex flex-col">
        <div className="flex pb-3 items-center justify-end gap-4 border-b border-slate-800">
          {/* <div className="rounded-full bg-white/6 px-3 py-1 text-xs">
            Workspace • Symplexia
          </div> */}
          <input
            className="hidden md:inline-block rounded-2xl bg-white/4 px-3 py-2 text-sm"
            placeholder="Search docs, tasks, agents..."
          />
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 grid place-items-center">
            Y
          </div>
        </div>
        {children}
      </div>
    </aside>
  );
}
