"use client";

import Image from "next/image";
// import Logo from "../../public/logo.webp";

export default function Header({ compact }: { compact?: boolean }) {
  return (
    <header
      className={`w-full ${
        compact ? "p-4" : "p-6"
      } border-b border-white/6 bg-gradient-to-b from-transparent to-black/10`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12">
            {/* <Image src={Logo} alt="logo" width={100} height={100} /> */}
          </div>
          <div className="text-sm">
            <div className="font-semibold">Symplexia Space</div>
            <div className="text-xs text-slate-400">AI • Workspace</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
      </div>
    </header>
  );
}
