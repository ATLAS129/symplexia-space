import { Columns } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({
  id,
  children,
  className,
}: {
  id: Columns;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className ?? ""} ${
        isOver ? "ring-2 ring-indigo-400/30" : ""
      }`}
      data-column-id={id}
    >
      {children}
    </div>
  );
}
