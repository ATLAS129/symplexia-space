"use client";

import { useEffect, useState, useRef } from "react";
import TaskCard from "@/components/TaskCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export default function DocumentPage() {
  return (
    <>
      {/* Center */}
      <section className="flex-1 p-7">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Document</h3>
            <div className="text-slate-400 text-sm">
              Collaborative rich-text document
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <Avatar />
              <Avatar />
              <Avatar />
            </div>
            <Button className="px-3 py-1 rounded-lg bg-white/6">Share</Button>
          </div>
        </div>

        <div className="mt-6 h-[64vh] rounded-2xl border border-white/6 bg-gradient-to-b from-slate-900 to-slate-950 p-6 overflow-auto">
          <div
            contentEditable
            suppressContentEditableWarning
            className="prose prose-invert max-w-none text-slate-100"
          >
            <h1>Homepage redesign — key points</h1>
            <p>Improve onboarding flow, add clearer CTAs, reduce friction.</p>

            <h2>Goals</h2>
            <ul>
              <li>Shorter signup funnel</li>
              <li>Better pricing page</li>
              <li>Integrated AI assistant for copy suggestions</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/3 p-4">
            <div className="font-semibold">Linked Tasks</div>
            <div className="text-slate-400 text-sm mt-2">
              Quickly create tasks from selection.
            </div>

            <div className="mt-4 grid gap-3">
              <TaskCard title="Rewrite hero copy" assignee="MK" due="Wed" />
              <TaskCard title="Add pricing table" assignee="EL" due="Mon" />
            </div>
          </div>

          <div className="rounded-xl bg-white/3 p-4">
            <div className="font-semibold">Activity</div>
            <div className="text-slate-400 text-sm mt-2">
              Recent edits, AI suggestions, and exports.
            </div>
          </div>
        </div>
      </section>

      {/* Right */}
      <aside className="w-96 p-6 border-l border-white/6 bg-gradient-to-b from-black/60 to-transparent">
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
        <div className="pt-3 flex items-center justify-between">
          <div className="font-semibold">AI Assistant</div>
          <div className="text-slate-400 text-xs">Context: Design Spec</div>
        </div>

        <div className="mt-4 space-y-3">
          <Button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 font-semibold">
            Summarize selection
          </Button>
          <Button className="w-full px-4 py-3 rounded-xl bg-white/6">
            Draft task
          </Button>
          <Button className="w-full px-4 py-3 rounded-xl border border-white/6">
            Suggest next steps
          </Button>
        </div>

        <div className="mt-6 p-3 rounded-lg bg-white/3 text-sm">
          <div className="font-medium">Quick summary</div>
          <div className="text-slate-400 text-xs mt-2">
            AI: "Focus on onboarding and hero copy. Convert features into
            benefits."
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-400">
          <div>• Daily summary (scheduled)</div>
          <div>• Auto-extract todos</div>
          <div>• Export audit logs</div>
        </div>
      </aside>
    </>
  );
}
