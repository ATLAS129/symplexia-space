"use client";
import React, { useMemo, useRef, useState } from "react";

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
import FilterModal from "@/components/FilterModal";
import RightAside from "@/components/RightAside";
import EditBoard from "@/components/tasks/EditBoard";
import Board from "@/components/tasks/Board";

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

type TasksFilter =
  | "mine"
  | "highPriority"
  | "mediumPriority"
  | "lowPriority"
  | "dueSoon"
  | "createdToday";

export default function TasksPage() {
  const [board, setBoard] = useState<BoardState>(() => {
    try {
      const raw = localStorage.getItem("board");
      return raw ? JSON.parse(raw) : initialBoard;
    } catch (e) {
      return initialBoard;
    }
  });

  const [tasksFilter, setTasksFilter] = useState<TasksFilter[]>([]);

  // keep track of the last saved board so "Discard" works reliably
  const lastSavedRef = useRef<BoardState>(board);

  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // new task dialog state
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Eli");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High">(
    "Medium"
  );

  const filtered = useMemo(() => {
    // no filters -> return original board unchanged
    if (!tasksFilter || tasksFilter.length === 0) return board;

    const now = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const endOfToday = startOfToday + msInDay - 1;
    // const dueSoonThreshold = now.getTime() + dueSoonDays * msInDay;

    const matches = (task: Task): boolean => {
      // if any filter matches -> include the task (OR logic)
      return tasksFilter.some((filter) => {
        switch (filter) {
          // case "mine":
          //   return !!task.assignee && task.assignee.name === currentUser;

          case "highPriority":
            return task.priority === "High";

          case "mediumPriority":
            return task.priority === "Medium";

          case "lowPriority":
            return task.priority === "Low";

          case "dueSoon": {
            if (!task.createdAt) return false;
            const t = new Date(task.createdAt).getTime();
            // dueSoon means timestamp is between now and dueSoonThreshold
            // return t >= now.getTime() && t <= dueSoonThreshold;
          }

          case "createdToday": {
            if (!task.createdAt) return false;
            const t = new Date(task.createdAt).getTime();
            return t >= startOfToday && t <= endOfToday;
          }

          default:
            return false;
        }
      });
    };

    const filteredBoard: BoardState = {
      todo: [],
      inprogress: [],
      done: [],
    };

    (Object.keys(board) as Columns[]).forEach((col) => {
      filteredBoard[col] = board[col].filter(matches);
    });

    return filteredBoard;
  }, [board, tasksFilter]);

  // save & discard helpers
  const saveBoard = () => {
    try {
      localStorage.setItem("board", JSON.stringify(board));
      lastSavedRef.current = board;
      setIsDirty(false);
      setIsEditing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save board", err);
    }
  };

  const discardChanges = () => {
    setBoard(lastSavedRef.current);
    setIsDirty(false);
    setIsEditing(false);
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

          {isEditing ? (
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
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                className="bg-indigo-500 hover:bg-indigo-500"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <FilterModal />
            </div>
          )}
        </div>

        {/* DnD context around columns */}
        {isEditing ? (
          <EditBoard
            board={filtered}
            setIsDirty={setIsDirty}
            setBoard={setBoard}
          />
        ) : (
          <Board board={filtered} />
        )}
      </section>

      {/* Right panel */}
      <RightAside>
        {/* <div className="pt-3 flex items-center justify-between">
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
        </div> */}
        <div className="mt-6">
          <div className="text-xs text-slate-400 mb-2">Quick filters</div>
          <div className="grid gap-2">
            {/* <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setTasksFilter((prev) =>
                  prev.includes("mine")
                    ? prev.filter((f) => f !== "mine")
                    : [...prev, "mine"]
                );
              }}
            >
              Assigned to me
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setTasksFilter((prev) =>
                  prev.includes("dueSoon")
                    ? prev.filter((f) => f !== "dueSoon")
                    : [...prev, "dueSoon"]
                );
              }}
            >
              Due soon
            </Button> */}
            {!isEditing && (
              <>
                <Button
                  className={`justify-start ${
                    tasksFilter.includes("lowPriority")
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                      : ""
                  }`}
                  onClick={() => {
                    setTasksFilter((prev) =>
                      prev.includes("lowPriority")
                        ? prev.filter((f) => f !== "lowPriority")
                        : [...prev, "lowPriority"]
                    );
                  }}
                >
                  Low priority
                </Button>
                <Button
                  className={`justify-start ${
                    tasksFilter.includes("mediumPriority")
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                      : ""
                  }`}
                  onClick={() => {
                    setTasksFilter((prev) =>
                      prev.includes("mediumPriority")
                        ? prev.filter((f) => f !== "mediumPriority")
                        : [...prev, "mediumPriority"]
                    );
                  }}
                >
                  Medium priority
                </Button>
                <Button
                  className={`justify-start ${
                    tasksFilter.includes("highPriority")
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                      : ""
                  }`}
                  onClick={() => {
                    setTasksFilter((prev) =>
                      prev.includes("highPriority")
                        ? prev.filter((f) => f !== "highPriority")
                        : [...prev, "highPriority"]
                    );
                  }}
                >
                  High priority
                </Button>
              </>
            )}
          </div>
        </div>
      </RightAside>
    </>
  );
}
