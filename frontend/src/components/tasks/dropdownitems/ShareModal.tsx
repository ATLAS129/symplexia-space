import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Task } from "@/types/types";
import { useState } from "react";

export default function ShareModal({ task }: { task: Task }) {
  const [copied, setCopied] = useState(false);

  const link = `localhost:3000/workspace/${task.projectId}/tasks/${task.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "copied" state after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text. Please try again.");
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
      <DialogHeader>
        <DialogTitle>Share task</DialogTitle>
        <DialogDescription>Soon will be added</DialogDescription>
      </DialogHeader>
      <div>
        <p>{link}</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleCopy} className="w-full">
            {copied ? "Copied!" : "Copy"}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
