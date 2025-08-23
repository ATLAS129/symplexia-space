"use client";

import NavItem from "@/components/NavItem";
import Avatar from "@/components/ui/Avatar";
import { redirect, usePathname } from "next/navigation";

const sideBars = ["Documents", "Tasks", "Members", "Settings"];

export default function layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left */}
        <aside className="w-72 p-5 border-r border-white/6 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 grid place-items-center font-bold"></div>
            <div>
              <div className="font-semibold">Test Team</div>
              <div className="text-xs text-slate-400">Workspace</div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {Array(4)
              .fill(null)
              .map((el, i) => (
                <NavItem
                  key={sideBars[i]}
                  label={sideBars[i]}
                  onClick={() =>
                    redirect(
                      `http://localhost:3000/workspace/${
                        i !== 0 ? sideBars[i].toLowerCase() : ""
                      }`
                    )
                  }
                  active={
                    pathName.slice(1).replace("workspace/", "") ===
                    sideBars[i].toLowerCase()
                  }
                />
              ))}
            {/* <NavItem
              label="Documents"
              onClick={() => redirect("http://localhost:3000/workspace/")}
            />
            <NavItem
              label="Tasks"
              onClick={() => redirect("http://localhost:3000/workspace/tasks")}
            />
            <NavItem label="Members" />
            <NavItem label="Settings" /> */}
          </nav>

          <div className="mt-8">
            <div className="text-xs text-slate-400">Members online</div>
            <div className="mt-3 flex -space-x-3">
              <Avatar initials="EL" />
              <Avatar initials="MK" />
              <Avatar initials="JS" />
              <div className="w-8 h-8 rounded-full grid place-items-center bg-white/6 text-xs">
                +3
              </div>
            </div>
          </div>
        </aside>

        {children}
      </div>
    </div>
  );
}
