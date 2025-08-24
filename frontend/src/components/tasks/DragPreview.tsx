import { Task } from "@/types/types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

export default function DragPreview({ task }: { task?: Task }) {
  if (!task) return null;
  return (
    <div className="w-3/4 rounded-xl p-3 bg-gradient-to-b from-indigo-600/60 to-pink-500/30 text-white shadow-2xl transform-gpu transition-all duration-180 ease-out scale-105">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            className="w-8 h-8"
            fallback={task.assignee?.initials ?? "U"}
          />
          <div>
            <div className="font-medium">{task.title}</div>
            <div className="text-xs mt-0.5 opacity-90">
              {task.assignee?.name ?? "Unassigned"} · {task.due ?? "No due"}
            </div>
          </div>
        </div>
        <Badge
          variant={
            task.priority === "High"
              ? "destructive"
              : task.priority === "Medium"
              ? "secondary"
              : "outline"
          }
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}
