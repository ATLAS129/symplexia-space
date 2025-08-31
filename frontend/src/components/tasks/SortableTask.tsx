import { useSortable } from "@dnd-kit/sortable";
import { Avatar } from "../ui/Avatar";
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

  // avoid writing "transform: undefined" when there's no transform
  const transformStyle = transform
    ? CSS.Transform.toString(transform)
    : undefined;
  const style: React.CSSProperties = {
    ...(transformStyle ? { transform: transformStyle } : {}),
    transition,
    touchAction: "manipulation",
  };

  return (
    <div
      ref={setNodeRef}
      data-task-id={id}
      style={style}
      {...attributes}
      {...listeners}
      role="listitem"
      tabIndex={0}
      className={`rounded-xl p-3 border bg-gradient-to-b from-black/60 to-black/30 shadow-md cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition hover:scale-[1.01] ${
        dragging ? "ring-2 ring-indigo-400/40" : "border-white/6"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9" />
          <div>
            <div className="font-medium text-sm leading-tight">
              {task.title}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {task.assignee?.name ?? "Unassigned"} ·{" "}
              {task.createdAt ?? "No due"}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
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
            {task.priority ?? "—"}
          </Badge>
          <div className="text-xs text-slate-400">⋯</div>
        </div>
      </div>
    </div>
  );
}
