"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Textarea";
import AvatarEdit from "@/components/AvatarEdit";

export default function SettingsPage() {
  const [settingsType, setSettingsType] = useState<
    "general" | "members" | "security" | "danger"
  >("general");

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

        <div className="w-full h-[calc(100vh-20%)] rounded-lg bg-slate-900 flex">
          {/* Settings content */}

          <aside className="p-6 h-full border-r [&>button]:w-full [&>button]:py-3 [&>button]:px-2 [&>button]:rounded-lg flex flex-col gap-2 border-slate-800">
            <Button variant="ghost">General</Button>
            <Separator />
            <Button variant="ghost">Members</Button>
            <Separator />
            <Button variant="ghost">Security</Button>
            <Separator />
            <Button variant="ghost">Danger</Button>
          </aside>

          <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-scroll">
            <h2 className="text-lg font-semibold">General</h2>
            <div className="flex justify-between items-center gap-5">
              <div className="flex-1 flex flex-col gap-4">
                <div className="w-full flex gap-4">
                  <Label htmlFor="project-name">Project name: </Label>
                  <Input
                    id="project-name"
                    className="w-full rounded-lg flex-1 h-14 bg-slate-800 flex items-center"
                  />
                </div>
                <div className="w-full flex gap-4">
                  <Label htmlFor="project-description">Description: </Label>
                  <textarea
                    id="project-description"
                    className="border max-h-[250px] min-h-14 rounded-lg flex-1 h-48 bg-slate-800 py-3 px-2 text-wrap"
                  />
                </div>
              </div>
              <div>
                <AvatarEdit />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
