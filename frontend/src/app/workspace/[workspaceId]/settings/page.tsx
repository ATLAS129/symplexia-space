"use client";

import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  return (
    <>
      <section className="flex-1 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Settings
            </h1>
            <p className="mt-1 text-slate-400 text-xs">Manage project</p>
          </div>
          <div className={`fixed top-0 right-0 p-6 w-1/6 flex flex-col`}>
            <div className="flex pb-3 items-center justify-end gap-4 border-slate-800">
              <input
                className="hidden md:inline-block rounded-2xl bg-white/4 px-3 py-2 text-sm"
                placeholder="Search docs, tasks, agents..."
              />
              <div className="min-w-9 min-h-9 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center">
                Y
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[calc(100vh-15%)] rounded-lg bg-slate-900 p-6">
          {/* Settings content */}
          <div className="flex gap-4 justify-center items-center">
            <p>Project name: </p>
            <div className="flex-1 h-10 bg-slate-800 rounded-lg flex items-center">
              <Input className="w-full h-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
