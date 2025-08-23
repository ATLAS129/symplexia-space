"use client";

import FeatureBlock from "@/components/FeatureBlock";
import SmallCard from "@/components/SmallCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function MainPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 px-10 py-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Build collaborative products faster
          </h2>
          <p className="text-slate-400 max-w-2xl mb-6">
            Realtime CRDT editing, integrated task boards, and safe LLM agents
            in a single, polished workspace. Scales from startups to
            enterprises.
          </p>

          <div className="grid gap-4">
            <FeatureBlock
              tag="Realtime"
              title="Reliable CRDT sync"
              desc="Yjs-powered editing, presence indicators, and conflict-free merges — instant collaboration at scale."
            />
            <FeatureBlock
              tag="AI"
              title="LLM Assistants"
              desc="Selection summarization, auto task drafting, and agent workflows with safety controls and audit logs."
            />
            <FeatureBlock
              tag="Security"
              title="Roles & Compliance"
              desc="Workspace roles, audit trails, export controls and enterprise settings."
            />
          </div>

          <div className="mt-8 flex gap-4">
            <Button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-lg font-semibold">
              <Link href="/workspace">Get started</Link>
            </Button>
            <Button className="px-6 py-3 rounded-2xl bg-white/6 hover:bg-white/8 transition">
              See demo
            </Button>
          </div>
        </section>

        <section>
          <div className="rounded-3xl bg-gradient-to-b from-black/60 to-black/30 p-5 shadow-2xl border border-white/6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 grid place-items-center font-bold"></div>
                <div>
                  <div className="font-semibold">Design Spec — Homepage</div>
                  <div className="text-xs text-slate-400">
                    Updated 18m • 4 collaborators
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-400">Live</div>
                <div className="w-8 h-8 rounded-full bg-white/6 grid place-items-center">
                  A
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden border border-white/6">
              <div className="h-56 bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-slate-300">
                Editor preview
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <SmallCard title="Kanban" subtitle="Linked tasks + drag & drop" />
              <SmallCard title="AI Assistant" subtitle="Summarize selection" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
