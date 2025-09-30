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

export default function ViewModal({ task }: { task: Task }) {
  return (
    <DialogContent className="sm:max-w-[425px] bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
      <DialogHeader>
        <DialogTitle>{task.title} task</DialogTitle>
        {/* <DialogDescription>
          {task.description ?? "No description"}
        </DialogDescription> */}
      </DialogHeader>
      <div className="flex flex-col gap-3 [&>*]:flex [&>*]:justify-between">
        <div className="w-full bg-gradient-to-l from-slate-950 to-slate-900 px-3 py-2 rounded-md">
          <h3>Title: </h3>
          <span className="flex-1 flex justify-center">{task.title}</span>
        </div>
        <div className="w-full bg-gradient-to-l from-slate-950 to-slate-900 px-3 py-2 rounded-md">
          <h3>Description: </h3>
          <span className="flex-1 flex justify-center">
            {task.description ?? "No description"}
          </span>
        </div>
        <div className="w-full bg-gradient-to-l from-slate-950 to-slate-900 px-3 py-2 rounded-md">
          <h3>Priority: </h3>
          <span
            className={`flex-1 flex justify-center ${
              task.priority === "High"
                ? "text-red-500"
                : task.priority === "Medium"
                ? "text-orange-400"
                : "text-green-500"
            }`}
          >
            {task.priority}
          </span>
        </div>
        <div className="w-full bg-gradient-to-l from-slate-950 to-slate-900 px-3 py-2 rounded-md">
          <h3>Status: </h3>
          <span className="flex-1 flex justify-center">
            {task.status[0].toUpperCase() + task.status.slice(1) === "Todo"
              ? "To Do"
              : task.status[0].toUpperCase() + task.status.slice(1) ===
                "Inprogress"
              ? "In Progress"
              : "Done"}
          </span>
        </div>
        <div className="w-full bg-gradient-to-l from-slate-950 to-slate-900 px-3 py-2 rounded-md">
          <h3>Assignee: </h3>
          <span className="flex-1 flex justify-center">
            {task.assignee?.name}
          </span>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
