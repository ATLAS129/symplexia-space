import { Columns } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";
import React, { useRef, useCallback } from "react";

export default function DroppableColumn({
  id,
  children,
  className,
  activeDragId,
  pointerX,
  pointerY,
}: {
  id: Columns;
  children: React.ReactNode;
  className?: string;
  // id of the currently dragged item (or null)
  activeDragId?: string | null;
  // pointer coordinates while dragging
  pointerX?: number | null;
  pointerY?: number | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const localRef = useRef<HTMLElement | null>(null);

  // compose refs: set both dnd-kit ref and local ref so we can measure bounds
  const refCallback = useCallback(
    (el: HTMLElement | null) => {
      localRef.current = el;
      // feed element to dnd-kit
      setNodeRef(el);
    },
    [setNodeRef]
  );

  // detect pointer-inside while dragging
  let pointerInside = false;
  if (
    activeDragId &&
    pointerX != null &&
    pointerY != null &&
    localRef.current instanceof HTMLElement
  ) {
    const rect = localRef.current.getBoundingClientRect();
    pointerInside =
      pointerX >= rect.left &&
      pointerX <= rect.right &&
      pointerY >= rect.top &&
      pointerY <= rect.bottom;
  }

  const isActive = isOver || pointerInside;

  const activeClasses = isActive
    ? // slight difference when pointerInside vs over (but keep visual consistent)
      "ring-2 ring-indigo-400/30 bg-white/5"
    : "";

  return (
    <div
      ref={refCallback}
      role="list"
      aria-label={`${id} column`}
      className={`${
        className ?? ""
      } min-h-[220px] p-2 rounded-lg ${activeClasses}`}
      data-column-id={id}
    >
      {children}
    </div>
  );
}
