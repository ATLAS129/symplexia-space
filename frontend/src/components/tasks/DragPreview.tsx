import { Task } from "@/types/types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

export default function DragPreview({ task }: { task?: Task }) {
  if (!task) return null;
  return (
    <div className="w-full rounded-xl p-3 bg-gradient-to-b from-indigo-600/60 to-pink-500/30 text-white shadow-2xl transform-gpu transition-all duration-180 ease-out scale-105">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8" />
          <div>
            <div className="font-medium">
              {task.title.length > 20
                ? `${task.title.slice(0, 20)}...`
                : task.title}
            </div>
            <div className="text-xs mt-0.5 opacity-90">
              {task.assignee?.name ?? "Unassigned"} ·
            </div>
          </div>
        </div>
        <Badge
          className={
            "text-xs " +
            (task.priority === "High"
              ? "bg-red-600/20 text-red-400"
              : task.priority === "Medium"
              ? "bg-yellow-600/20 text-yellow-400"
              : task.priority === "Low"
              ? "bg-green-600/20 text-green-400"
              : "bg-slate-600/20 text-slate-400")
          }
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}
