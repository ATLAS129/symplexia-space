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
    title: "Thoughts",
    description: "big ideasss",
    createdAt: new Date("2024-02-04"),
  },
  {
    id: 3,
    title: "Library",
    description: "books for rich people lol",
    createdAt: new Date("2025-02-04"),
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
              <h1 className="text-2xl font-semibold">Documents</h1>
              <div className="text-lg text-slate-400">{documents.length}</div>
            </div>

            <div className="text-xs text-slate-400">Editor • AI</div>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
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

            <Button variant="outline">Filter</Button>
          </div>
        </div>
        <DocumentsCards documents={documents} />
      </section>
    </>
  );
}
