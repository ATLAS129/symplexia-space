"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
import { BoardState, Columns, Task, TasksFilter } from "@/types/types";
import FilterModal from "@/components/FilterModal";
import RightAside from "@/components/RightAside";
import EditBoard from "@/components/tasks/EditBoard";
import Board from "@/components/tasks/Board";
import { PenLine } from "lucide-react";
import RightAsideFilters from "@/components/tasks/RightAsideFilter";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addTask,
  setBoard as setBoardAction,
} from "@/lib/states/workspaceSlice";

export default function TasksPage() {
  // board is now stored in redux
  const board = useAppSelector((state) => state.workspace.board) as BoardState;
  const dispatch = useAppDispatch();
  const tasks: Task[] = useAppSelector(
    (state) => state.workspace.tasks
  ) as Task[];
  const projectId = useAppSelector((state) => state.workspace.projectId);

  console.log(tasks);

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
  const [assigneeFilter, setAssigneeFilter] = useState<"everyone" | "me">(
    "everyone"
  );
  const [searchQuery, setSearchQuery] = useState("");

  type Options = {
    currentUser?: string;
    dueSoonDays?: number;
  };
  function filterAndSearchBoard(
    board: BoardState,
    query: string | null | undefined,
    tasksFilter?: TasksFilter[] | null,
    options: Options = { currentUser: "Eli" }
  ): BoardState {
    const q = (query ?? "").trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    const hasQuery = tokens.length > 0;

    const filters = tasksFilter ?? [];
    const hasFilters = filters.length > 0;

    if (!hasQuery && !hasFilters) return board;

    const now = Date.now();
    const msInDay = 1000 * 60 * 60 * 24;
    const startOfToday = new Date(new Date(now).setHours(0, 0, 0, 0)).getTime();
    const dueSoonDays = options.dueSoonDays ?? 7;
    const dueSoonThreshold = now + dueSoonDays * msInDay;

    const matchesSearch = (task: Task) => {
      if (!hasQuery) return true;
      const title = task.title ?? "";
      const assigneeName = task.assignee?.name ?? "";
      const priority = task.priority ?? "";
      const createdAt = task.createdAt ?? "";

      const hay =
        `${title} ${assigneeName} ${priority} ${createdAt}`.toLowerCase();
      return tokens.every((t) => hay.indexOf(t) !== -1);
    };

    const matchesFilterKey = (task: Task, key: TasksFilter) => {
      switch (key) {
        case "highPriority":
          return task.priority === "High";
        case "mediumPriority":
          return task.priority === "Medium";
        case "lowPriority":
          return task.priority === "Low";
        case "createdToday": {
          if (!task.createdAt) return false;
          const t = Date.parse(task.createdAt);
          if (isNaN(t)) return false;
          return t >= startOfToday && t <= startOfToday + msInDay - 1;
        }
        case "dueSoon": {
          if (!task.createdAt) return false;
          const t = Date.parse(task.createdAt);
          if (isNaN(t)) return false;
          return t >= now && t <= dueSoonThreshold;
        }
        case "mine": {
          const user = options.currentUser;
          if (!user) return false;
          return !!task.assignee && task.assignee.name.includes(user);
        }
        default:
          return false;
      }
    };

    const matchesFilters = (task: Task) => {
      if (!hasFilters) return true;
      return filters.some((f) => matchesFilterKey(task, f));
    };

    // Build result preserving columns and order
    const result: BoardState = {} as BoardState;
    const cols = Object.keys(board) as Columns[];
    for (const col of cols) {
      result[col] = board[col].filter(
        (task) => matchesSearch(task) && matchesFilters(task)
      );
    }

    return result;
  }

  const filtered = useMemo(() => {
    return filterAndSearchBoard(board, searchQuery, tasksFilter, {
      currentUser: "Eli",
      dueSoonDays: 3,
    });
  }, [board, tasks, searchQuery, tasksFilter]);

  // save & discard helpers
  const saveBoard = () => {
    try {
      localStorage.setItem("board", JSON.stringify(board));
      dispatch(setBoardAction({ board }));
      lastSavedRef.current = board;
      setIsDirty(false);
      setIsEditing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save board", err);
    }
  };

  const discardChanges = () => {
    // revert redux board to last saved
    dispatch(setBoardAction({ board: lastSavedRef.current }));
    setIsDirty(false);
    setIsEditing(false);
  };

  const submitNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      projectId: projectId as string,
      title: newTitle.trim() || "Untitled task",
      assignee: {
        name: [newAssignee || "Eli"],
      },
      status: "todo",
      priority: newPriority,
      createdAt: new Date().toDateString().slice(0, 3),
    };

    setIsEditing(true);
    dispatch(addTask({ task: newTask }));
    // keep the redux board in sync locally
    const nextBoard: BoardState = { ...board, todo: [newTask, ...board.todo] };
    dispatch(setBoardAction({ board: nextBoard }));
    setNewTitle("");
    setNewAssignee("Eli");
    setNewPriority("Medium");
    setIsDirty(true);
  };

  // wrapper that accepts either a BoardState or an updater function (like setState)
  const setBoardWrapper = (
    next: BoardState | ((prev: BoardState) => BoardState)
  ) => {
    const newBoard = typeof next === "function" ? (next as any)(board) : next;
    dispatch(setBoardAction({ board: newBoard }));
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600">
                  + New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
                <DialogHeader>
                  <DialogTitle>Create task</DialogTitle>
                  <DialogDescription>
                    Quickly add a task to the board.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-2 [&>*]:border-slate-500">
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
                    <Button>Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={submitNewTask}>Create task</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {isEditing ? (
              <>
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
              </>
            ) : (
              <>
                <FilterModal
                  tasksFilter={tasksFilter}
                  setTasksFilter={setTasksFilter}
                  assigneeFilter={assigneeFilter}
                  setAssigneeFilter={setAssigneeFilter}
                />
                <Button
                  className="bg-indigo-500"
                  onClick={() => {
                    lastSavedRef.current = board;
                    setIsEditing(true);
                  }}
                >
                  <PenLine />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* DnD context around columns */}
        {isEditing ? (
          <EditBoard
            board={board}
            setIsDirty={setIsDirty}
            setBoard={setBoardWrapper}
          />
        ) : (
          <Board board={filtered as BoardState} />
        )}
      </section>

      {/* Right panel */}
      <RightAside>
        {!isEditing ? (
          <RightAsideFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            tasksFilter={tasksFilter}
            assigneeFilter={assigneeFilter}
            setAssigneeFilter={setAssigneeFilter}
            setTasksFilter={(p) =>
              setTasksFilter((prev) =>
                prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
              )
            }
            onClear={() => {
              setTasksFilter([]);
              setAssigneeFilter("everyone");
              setSearchQuery("");
            }}
          />
        ) : (
          ""
        )}
      </RightAside>
    </>
  );
}
