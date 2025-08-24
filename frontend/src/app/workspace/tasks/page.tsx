"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { BoardState, Columns, Task } from "@/types/types";
import SortableTask from "@/components/tasks/SortableTask";
import DragPreview from "@/components/tasks/DragPreview";
import DroppableColumn from "@/components/tasks/DroppableColumn";

const initialBoard: BoardState = {
  todo: [
    {
      id: "t-1",
      title: "Design system: tokens + components",
      assignee: { name: "Eli", initials: "EL" },
      priority: "High",
      due: "Wed",
    },
    {
      id: "t-2",
      title: "Write onboarding copy",
      assignee: { name: "Maya", initials: "MK" },
      priority: "Medium",
      due: "Fri",
    },
  ],
  inprogress: [
    {
      id: "t-3",
      title: "Realtime sync (Yjs) POC",
      assignee: { name: "Jon", initials: "JS" },
      priority: "High",
      due: "Thu",
    },
  ],
  done: [
    {
      id: "t-4",
      title: "Landing page hero",
      assignee: { name: "Eli", initials: "EL" },
      priority: "Low",
      due: "Yesterday",
    },
  ],
};

export default function TasksPage() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  // last known pointer Y while dragging (used to decide insert before/after)
  const [pointerX, setPointerX] = useState<number | null>(null);
  const [pointerY, setPointerY] = useState<number | null>(null);

  // new task dialog state
  const [openNew, setOpenNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Eli");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High">(
    "Medium"
  );

  // sensors: pointer + keyboard (keyboard supports accessible sorting)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // helper: find column that contains id
  const findColumnOf = (id: string | null): Columns | null => {
    if (!id) return null;
    const k = (Object.keys(board) as Columns[]).find((col) =>
      board[col].some((t) => t.id === id)
    );
    return (k ?? null) as Columns | null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const active = event?.active;
    const activeId = active?.id as string | undefined;
    if (!active || !activeId) return;
    setActiveId(activeId);
    const col = findColumnOf(activeId);
    if (col) {
      const t = board[col].find((x) => x.id === activeId) ?? null;
      setDraggingTask(t);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    try {
      const active = event?.active;
      const over = event?.over;
      const activeId = active?.id as string | undefined;
      const overId = over?.id as string | undefined;

      // clear UI drag state immediately
      setActiveId(null);
      setDraggingTask(null);

      if (!activeId || !overId) return;

      const isOverColumn = (Object.keys(board) as string[]).includes(overId);

      const sourceCol = findColumnOf(activeId);
      const destCol = isOverColumn ? (overId as Columns) : findColumnOf(overId);
      if (!sourceCol || !destCol) return;

      const sourceIndex = board[sourceCol].findIndex((t) => t.id === activeId);
      if (sourceIndex < 0) return;

      const destIndex =
        isOverColumn === true
          ? board[destCol].length
          : board[destCol].findIndex((t) => t.id === overId);

      // same column reorder (simple case)
      if (sourceCol === destCol) {
        if (destIndex >= 0 && sourceIndex !== destIndex) {
          setBoard((prev) => ({
            ...prev,
            [sourceCol]: arrayMove(prev[sourceCol], sourceIndex, destIndex),
          }));
        }
        return;
      }

      // cross-column move: decide whether to insert before or after the over-task
      let insertAt = destIndex >= 0 ? destIndex : board[destCol].length;

      if (!isOverColumn && destIndex >= 0 && pointerY != null) {
        // try to find the target DOM element for overId
        const overEl = document.querySelector(
          `[data-task-id="${overId}"]`
        ) as HTMLElement | null;
        if (overEl) {
          const rect = overEl.getBoundingClientRect();
          // if pointer is below the vertical midpoint of the target element, insert after
          if (pointerY > rect.top + rect.height / 2) {
            insertAt = destIndex + 1;
          } else {
            insertAt = destIndex;
          }
        }
      }

      const taskToMove = board[sourceCol][sourceIndex];
      if (!taskToMove) return;

      setBoard((prev) => {
        const newSource = prev[sourceCol].filter((t) => t.id !== activeId);
        const newDest = [...prev[destCol]];
        const at = Math.min(Math.max(insertAt, 0), newDest.length);
        newDest.splice(at, 0, taskToMove);
        return { ...prev, [sourceCol]: newSource, [destCol]: newDest };
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("handleDragEnd error:", err);
    } finally {
      // reset pointer tracking after drop
      setPointerY(null);
    }
  };

  // track pointer Y during drag (mouse and touch) so we can decide before/after on drop
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (e instanceof TouchEvent) {
        const t = e.touches?.[0];
        setPointerX(t?.clientX ?? null);
        setPointerY(t?.clientY ?? null);
      } else {
        const ev = e as MouseEvent;
        setPointerX(ev.clientX);
        setPointerY(ev.clientY);
      }
    }

    if (activeId) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove);
        setPointerX(null);
        setPointerY(null);
      };
    }
    // cleanup when not dragging
    setPointerX(null);
    setPointerY(null);
    return;
  }, [activeId]);

  const submitNewTask = () => {
    const newTask: Task = {
      // changed: use a stable unique id
      id: Date.now().toString(),
      title: newTitle.trim() || "Untitled task",
      assignee: {
        name: newAssignee,
        initials: newAssignee.slice(0, 2).toUpperCase(),
      },
      priority: newPriority,
      due: "TBD",
    };
    setBoard((prev) => ({ ...prev, todo: [newTask, ...prev.todo] }));
    // reset
    setNewTitle("");
    setNewAssignee("Eli");
    setNewPriority("Medium");
    setOpenNew(false);
  };

  const columnOrder = useMemo(
    () => ["todo", "inprogress", "done"] as Columns[],
    []
  );

  return (
    <>
      {/* Main area */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <div className="text-xs text-slate-400">
              Kanban • Drag & drop • AI helpers
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  + New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create task</DialogTitle>
                  <DialogDescription>
                    Quickly add a task to the board.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-2">
                  <label className="text-xs text-slate-400">Title</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Fix signup flow"
                  />

                  <label className="text-xs text-slate-400">Assignee</label>
                  <Input
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    placeholder="Eli"
                  />

                  <label className="text-xs text-slate-400">Priority</label>
                  <Select onValueChange={(v) => setNewPriority(v as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue>{newPriority}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenNew(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitNewTask}>Create task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline">Filter</Button>
          </div>
        </div>

        {/* DnD context around columns */}
        <div className="rounded-xl bg-gradient-to-b from-black/40 to-black/20 p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => handleDragStart(e as DragStartEvent)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => {
              setActiveId(null);
              setDraggingTask(null);
            }}
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.8",
                  },
                },
              }),
            }}
          >
            <div className="flex justify-between gap-6">
              {columnOrder.map((colId) => {
                const columnTasks = board[colId];
                return (
                  <DroppableColumn
                    key={colId}
                    id={colId}
                    className="w-1/3 min-h-screen flex flex-col"
                    // provide pointer and active drag id so the column can detect pointer hover even when nested items are droppables
                    activeDragId={activeId}
                    pointerX={pointerX}
                    pointerY={pointerY}
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
                      <div className="flex-1 flex flex-col gap-3 h-full">
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
      </main>

      {/* Right panel */}
      {/* <aside className="w-80 p-6 border-l border-white/6 bg-gradient-to-b from-black/30 to-transparent">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">AI Tools</h4>
          <div className="text-xs text-slate-400">beta</div>
        </div>

        <div className="mt-4 space-y-3">
          <Button
            onClick={() => alert("Summarize board (stub)")}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Summarize board
          </Button>
          <Button
            onClick={() => alert("Draft tasks from selection (stub)")}
            className="w-full"
          >
            Auto-draft tasks
          </Button>
          <Button
            onClick={() => alert("Auto-assign (stub)")}
            className="w-full"
          >
            Auto-assign
          </Button>
        </div>

        <div className="mt-6">
          <div className="text-xs text-slate-400 mb-2">Quick filters</div>
          <div className="grid gap-2">
            <Button variant="ghost" className="justify-start">
              Assigned to me
            </Button>
            <Button variant="ghost" className="justify-start">
              Due soon
            </Button>
            <Button variant="ghost" className="justify-start">
              High priority
            </Button>
          </div>
        </div>
      </aside> */}
    </>
  );
}
