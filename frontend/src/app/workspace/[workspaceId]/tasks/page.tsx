"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  closestCorners,
  rectIntersection,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
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
  DialogClose,
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
import FilterModal from "@/components/FilterModal";
import RightAside from "@/components/RightAside";

const initialBoard: BoardState = {
  todo: [
    {
      id: "t-1",
      title: "Design system: tokens + components",
      assignee: { name: "Eli", initials: "EL" },
      priority: "High",
      createdAt: "Wed",
    },
    {
      id: "t-2",
      title: "Write onboarding copy",
      assignee: { name: "Maya", initials: "MK" },
      priority: "Medium",
      createdAt: "Fri",
    },
  ],
  inprogress: [
    {
      id: "t-3",
      title: "Realtime sync (Yjs) POC",
      assignee: { name: "Jon", initials: "JS" },
      priority: "High",
      createdAt: "Thu",
    },
  ],
  done: [
    {
      id: "t-4",
      title: "Landing page hero",
      assignee: { name: "Eli", initials: "EL" },
      priority: "Low",
      createdAt: "Yesterday",
    },
  ],
};

const COLUMN_ORDER: Columns[] = ["todo", "inprogress", "done"];

export default function TasksPage() {
  // lazy init from localStorage
  const [board, setBoard] = useState<BoardState>(() => {
    try {
      const raw = localStorage.getItem("board");
      return raw ? JSON.parse(raw) : initialBoard;
    } catch (e) {
      return initialBoard;
    }
  });

  // keep track of the last saved board so "Discard" works reliably
  const lastSavedRef = useRef<BoardState>(board);

  const [isDirty, setIsDirty] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);

  // track pointer Y while dragging to decide insert before/after
  const pointerYRef = useRef<number | null>(null);

  // new task dialog state
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Eli");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High">(
    "Medium"
  );

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
        setBoard((prev) => ({
          ...prev,
          [sourceCol]: arrayMove(prev[sourceCol], sourceIndex, destIndex),
        }));
        setIsDirty(true);
      }
      pointerYRef.current = null;
      return;
    }

    // cross-column move
    const taskToMove = board[sourceCol][sourceIndex];
    if (!taskToMove) return;

    setBoard((prev) => {
      const newSource = prev[sourceCol].filter((t) => t.id !== activeId);
      const newDest = [...prev[destCol]];
      const at = Math.min(Math.max(destIndex, 0), newDest.length);
      newDest.splice(at, 0, taskToMove);
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

    pointerYRef.current = null;
    return;
  }, [activeId]);

  // save & discard helpers
  const saveBoard = () => {
    try {
      localStorage.setItem("board", JSON.stringify(board));
      lastSavedRef.current = board;
      setIsDirty(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save board", err);
    }
  };

  const discardChanges = () => {
    setBoard(lastSavedRef.current);
    setIsDirty(false);
  };

  const submitNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.trim() || "Untitled task",
      assignee: {
        name: newAssignee,
        initials: newAssignee.slice(0, 2).toUpperCase(),
      },
      priority: newPriority,
      createdAt: new Date().toDateString().slice(0, 3),
    };

    setBoard((prev) => ({ ...prev, todo: [newTask, ...prev.todo] }));
    setNewTitle("");
    setNewAssignee("Eli");
    setNewPriority("Medium");
    setIsDirty(true);
  };

  return (
    <>
      {/* Main area */}
      <section className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Tasks
            </h1>
            <div className="text-xs text-slate-400">
              Kanban • Drag & drop • AI helpers
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={saveBoard}
              className="bg-indigo-500 hover:bg-indigo-500"
              disabled={!isDirty}
            >
              Save
            </Button>
            <Button
              onClick={discardChanges}
              className="bg-indigo-700 hover:bg-indigo-700"
              disabled={!isDirty}
            >
              Discard Changes
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600">
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
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={submitNewTask}>Create task</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <FilterModal />
          </div>
        </div>

        {/* DnD context around columns */}
        <div className="rounded-xl p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
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
                      <div className="flex flex-col gap-3 h-full">
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
      </section>

      {/* Right panel */}
      <RightAside>
        <div className="pt-3 flex items-center justify-between">
          <h4 className="font-semibold">AI Tools</h4>
          <div className="text-xs text-slate-400">beta</div>
        </div>
        <div className="mt-4 space-y-3">
          <Button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 font-semibold">
            Summarize selection
          </Button>
          <Button className="w-full px-4 py-3 rounded-xl bg-white/6">
            Draft task
          </Button>
          <Button className="w-full px-4 py-3 rounded-xl border border-white/6">
            Suggest next steps
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
      </RightAside>
    </>
  );
}
