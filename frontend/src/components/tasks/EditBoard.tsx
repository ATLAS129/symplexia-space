import { useState, useEffect, useCallback, useRef } from "react";
import { BoardState, Columns, Task } from "@/types/types";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import DroppableColumn from "./DroppableColumn";
import SortableTask from "./SortableTask";
import DragPreview from "./DragPreview";
import { useAppDispatch } from "@/lib/hooks";
import { moveTask } from "@/lib/states/workspaceSlice";

const COLUMN_ORDER: Columns[] = ["todo", "inprogress", "done"];

export default function EditBoard({
  board,
  setBoard,
  setIsDirty,
}: {
  board: BoardState;
  setBoard: (board: any) => void;
  setIsDirty: (dirty: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);

  // track pointer Y while dragging to decide insert before/after
  const pointerYRef = useRef<number | null>(null);

  // sensors with keyboard support for accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // helper: find column that contains id
  const findColumnOf = useCallback(
    (id: string | null): Columns | null => {
      if (!id) return null;
      const keys = Object.keys(board) as Columns[];
      const k = keys.find((col) => board[col].some((t) => t.id === id));
      return (k ?? null) as Columns | null;
    },
    [board]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const active = event.active;
    const id = active?.id as string | undefined;
    if (!id) return;
    setActiveId(id);
    const col = findColumnOf(id);
    if (col) {
      setDraggingTask(board[col].find((t) => t.id === id) ?? null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const active = event.active;
    const over = event.over;
    const activeId = active?.id as string | undefined;
    const overId = over?.id as string | undefined;

    // clear overlay UI state
    setActiveId(null);
    setDraggingTask(null);

    if (!activeId || !overId) return;

    const isOverColumn = (Object.keys(board) as string[]).includes(overId);

    const sourceCol = findColumnOf(activeId);
    const destCol = isOverColumn ? (overId as Columns) : findColumnOf(overId);
    if (!sourceCol || !destCol) return;

    const sourceIndex = board[sourceCol].findIndex((t) => t.id === activeId);
    if (sourceIndex < 0) return;

    // determine destination index
    let destIndex =
      isOverColumn === true
        ? board[destCol].length
        : board[destCol].findIndex((t) => t.id === overId);

    // when moving across columns and dropping on an item, use pointerY to pick before/after
    if (!isOverColumn && destIndex >= 0 && pointerYRef.current != null) {
      const overEl = document.querySelector(
        `[data-task-id="${overId}"]`
      ) as HTMLElement | null;
      if (overEl) {
        const rect = overEl.getBoundingClientRect();
        if (pointerYRef.current > rect.top + rect.height / 2)
          destIndex = destIndex + 1;
      }
    }

    // same column reorder
    if (sourceCol === destCol) {
      if (destIndex >= 0 && sourceIndex !== destIndex) {
        setBoard((prev: any) => ({
          ...prev,
          [sourceCol]: arrayMove(prev[sourceCol], sourceIndex, destIndex),
        }));
        setIsDirty(true);
      }
      pointerYRef.current = null;
      return;
    }

    // cross-column move: delegate to Redux moveTask (keeps board+tasks consistent)
    const taskToMove = board[sourceCol][sourceIndex];
    if (!taskToMove) return;

    // dispatch move to redux, parent (page) still holds the canonical setBoard in its wrapper
    dispatch(
      moveTask({
        id: taskToMove.id,
        from: sourceCol,
        to: destCol,
        index: destIndex,
      })
    );

    setBoard((prev: any) => {
      const newSource = prev[sourceCol].filter((t: any) => t.id !== activeId);
      const newDest = [...prev[destCol]];
      const at = Math.min(Math.max(destIndex, 0), newDest.length);
      const moved = { ...taskToMove, status: destCol };
      newDest.splice(at, 0, moved);
      return { ...prev, [sourceCol]: newSource, [destCol]: newDest };
    });
    setIsDirty(true);
    pointerYRef.current = null;
  };

  // track pointer Y while dragging (mouse and touch)
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (e instanceof TouchEvent) {
        const t = e.touches?.[0];
        pointerYRef.current = t?.clientY ?? null;
      } else {
        const ev = e as MouseEvent;
        pointerYRef.current = ev.clientY;
      }
    }

    if (activeId) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove);
        pointerYRef.current = null;
      };
    }

    // setIsDirty(true);
    // console.log("useEffect - true");
    pointerYRef.current = null;
    return;
  }, [activeId]);

  // save & discard helpers
  //   const saveBoard = () => {
  //     try {
  //       localStorage.setItem("board", JSON.stringify(board));
  //       lastSavedRef.current = board;
  //       setIsDirty(false);
  //       setIsEditing(false);
  //     } catch (err) {
  //       // eslint-disable-next-line no-console
  //       console.error("Failed to save board", err);
  //     }
  //   };

  //   const discardChanges = () => {
  //     setBoard(lastSavedRef.current);
  //     setIsDirty(false);
  //     setIsEditing(false);
  //   };

  //   const submitNewTask = () => {
  //     const newTask: Task = {
  //       id: Date.now().toString(),
  //       title: newTitle.trim() || "Untitled task",
  //       assignee: {
  //         name: newAssignee,
  //         initials: newAssignee.slice(0, 2).toUpperCase(),
  //       },
  //       priority: newPriority,
  //       createdAt: new Date().toDateString().slice(0, 3),
  //     };

  //     setBoard((prev) => ({ ...prev, todo: [newTask, ...prev.todo] }));
  //     setNewTitle("");
  //     setNewAssignee("Eli");
  //     setNewPriority("Medium");
  //     setIsDirty(true);
  //   };

  return (
    <div className="rounded-xl">
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveId(null);
          setDraggingTask(null);
        }}
      >
        <div className="flex justify-between flex-col md:flex-row gap-6">
          {COLUMN_ORDER.map((colId) => {
            const columnTasks = board[colId];
            return (
              <DroppableColumn
                key={colId}
                id={colId}
                className="w-full md:w-1/3 flex flex-col"
                activeDragId={activeId}
                pointerY={pointerYRef.current}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold capitalize">
                    {colId === "todo"
                      ? "To do"
                      : colId === "inprogress"
                      ? "In progress"
                      : "Done"}
                  </h3>
                  <div className="text-xs text-slate-400">
                    {columnTasks.length}
                  </div>
                </div>

                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3 flex-1">
                    {columnTasks.length === 0 ? (
                      <div className="rounded-lg p-4 border border-dashed border-white/6 text-slate-400 text-sm">
                        No tasks yet — drop here or create one
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          id={task.id}
                          task={task}
                          dragging={activeId === task.id}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </div>

        {/* Drag overlay preview */}
        <DragOverlay>
          {draggingTask ? <DragPreview task={draggingTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
