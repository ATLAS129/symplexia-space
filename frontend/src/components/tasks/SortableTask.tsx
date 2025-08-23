import { useSortable } from "@dnd-kit/sortable";
import Avatar from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Task } from "@/types/types";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTask({
  task,
  id,
  dragging,
}: {
  task: Task;
  id: string;
  dragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "manipulation" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-xl p-3 border ${
        dragging ? "ring-2 ring-indigo-400/40" : "border-white/6"
      } bg-gradient-to-b from-black/60 to-black/30 shadow-md cursor-grab`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            className="w-9 h-9"
            fallback={task.assignee?.initials ?? "U"}
          />
          <div>
            <div className="font-medium text-sm leading-tight">
              {task.title}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {task.assignee?.name ?? "Unassigned"} · {task.due ?? "No due"}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={
              task.priority === "High"
                ? "destructive"
                : task.priority === "Medium"
                ? "secondary"
                : "outline"
            }
          >
            {task.priority ?? "—"}
          </Badge>
          <div className="text-xs text-slate-400">⋯</div>
        </div>
      </div>
    </div>
  );
}
