"use client";

import { useState } from "react";
import DocumentsCards from "@/components/DocumentsCards";
import { Button } from "@/components/ui/Button";
import {
  DialogFooter,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Document } from "@/types/types";

const initialCards: Document[] = [
  {
    id: 1,
    title: "Finances",
    description: "calculating moneeey",
    createdAt: new Date("2024-02-04"),
  },
  {
    id: 2,
    title: "Project plan",
    description: "Outline for Q2 launch",
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Library",
    description: "books for rich people lol",
    createdAt: new Date("2025-08-26"),
  },
];

export default function WorkspacePage() {
  const [documents, setDocuments] = useState(initialCards);
  const [openNew, setOpenNew] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("Eli");

  const submitNewDocument = () => {
    const newDocument: Document = {
      // changed: use a stable unique id
      id: Math.floor(Math.random() * 1000000),
      title: title.trim() || "Untitled task",
      description: description.trim() || "No description",
      createdAt: new Date(),
    };

    setDocuments([...documents, newDocument]);
    // reset
    setTitle("");
    setDescription("Eli");
    setOpenNew(false);
  };

  return (
    <>
      <section className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Documents
              </h1>
              <div className="text-lg font-semibold rounded-full bg-slate-800 w-7 h-7 flex justify-center items-center text-white translate-y-0.5">
                {documents.length}
              </div>
            </div>

            <p className="mt-1 text-slate-400 text-xs">Editor • AI</p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600">
                  + New Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create document</DialogTitle>
                  <DialogDescription>Quickly add a document.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-2">
                  <label className="text-xs text-slate-400">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Fix signup flow"
                  />

                  <label className="text-xs text-slate-400">Assignee</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Eli"
                  />
                </div>

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenNew(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitNewDocument}>Create document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button className="bg-gradient-to-b from-indigo-600 to-indigo-500 hover:to-indigo-600">
              Filter
            </Button>
          </div>
        </div>
        <DocumentsCards documents={documents} />
      </section>

      {/* Right */}
      <aside className="max-w-1/5 w-1/5 border-l border-white/6 bg-gradient-to-b from-black/60 to-transparent flex justify-center">
        <div className="fixed p-6">
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
        </div>
      </aside>
    </>
  );
}
