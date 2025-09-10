import { useSortable } from "@dnd-kit/sortable";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Task } from "@/types/types";
import { CSS } from "@dnd-kit/utilities";
import SingleTask from "./SingleTask";

export default function SortableTask({
  task,
  id,
  dragging,
}: {
  task: Task;
  id: string;
  dragging?: boolean;
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
      <SingleTask task={task} />
    </div>
  );
}
