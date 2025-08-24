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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Task } from "@/types/types";

const initialCards = [
  {
    id: 1,
    title: "Finances",
    description: "calculating moneeey",
  },
  {
    id: 2,
    title: "Thoughts",
    description: "big ideasss",
  },
  {
    id: 3,
    title: "Library",
    description: "books for rich people lol",
  },
];

export default function WorkspacePage() {
  const [openNew, setOpenNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Eli");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High">(
    "Medium"
  );

  const submitNewTask = () => {
    const newTask: Task = {
      // changed: use a stable unique id
      id: Date.now().toString(),
      title: newTitle.trim() || "Untitled task",
      assignee: {
        name: newAssignee,
        initials: newAssignee.slice(0, 2).toUpperCase(),
      },
      priority: newPriority,
      due: "TBD",
    };
    // reset
    setNewTitle("");
    setNewAssignee("Eli");
    setNewPriority("Medium");
    setOpenNew(false);
  };

  return (
    <>
      <section className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Documents</h1>
              <div className="text-lg text-slate-400">
                {initialCards.length}
              </div>
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
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Fix signup flow"
                  />

                  <label className="text-xs text-slate-400">Assignee</label>
                  <Input
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    placeholder="Eli"
                  />
                </div>

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenNew(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitNewTask}>Create document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline">Filter</Button>
          </div>
        </div>
        <DocumentsCards initialCards={initialCards} />
      </section>
    </>
  );
}
