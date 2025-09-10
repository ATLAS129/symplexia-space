import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";
import { BoardState, Columns, Task, TasksFilter } from "@/types/types";
import { Switch } from "../ui/Switch";
import { Label } from "../ui/Label";

type Props = {
  // controlled props (you can pass your tasksFilter state here)
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  tasksFilter: TasksFilter[]; // e.g. ["Low","High"]
  setTasksFilter: (p: TasksFilter) => void;
  assigneeFilter: "everyone" | "me";
  setAssigneeFilter: (v: "everyone" | "me") => void;
  onClear: () => void;
};

export default function RightAsideFilters({
  searchQuery,
  setSearchQuery,
  tasksFilter = ["lowPriority", "mediumPriority", "highPriority"],
  setTasksFilter,
  assigneeFilter = "everyone",
  setAssigneeFilter,
  onClear,
}: Props) {
  const isActive = (p: TasksFilter) => tasksFilter.includes(p);

  return (
    <div className="py-4 px-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-300">Filters</div>
          <div className="text-xs text-slate-400">Refine visible tasks</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-1 rounded-md text-slate-400 hover:bg-white/5"
            onClick={onClear}
            aria-label="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search (optional) */}
      <div className="mt-4">
        <label className="sr-only">Search tasks</label>
        <div className="relative">
          <Input
            placeholder="Search tasks, assignees, titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm"
            aria-label="Search tasks"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Priority pills */}
      <div className="mt-5">
        <div className="text-sm font-semibold text-slate-200 mb-2">
          By tasks
        </div>

        <div className="flex gap-2">
          {["Low", "Medium", "High"].map((p) => {
            const priority = p.toLowerCase() + "Priority";
            return (
              <button
                key={p}
                onClick={() => setTasksFilter(priority as TasksFilter)}
                className={`flex-1 text-xs font-medium py-2 rounded-full shadow-inner transition-all duration-150 focus:outline-none 
                ${
                  isActive(priority as TasksFilter)
                    ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-white/3"
                }`}
                aria-pressed={isActive(priority as TasksFilter)}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Assignee toggle */}
      <div className="mt-5">
        <div className="text-sm font-semibold text-slate-200 mb-2">
          By assignee
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="w-1/3 flex justify-center">
            <Label>Everyone</Label>
          </div>
          <Switch
            className=""
            checked={assigneeFilter === "me"}
            onCheckedChange={() =>
              setAssigneeFilter(assigneeFilter === "me" ? "everyone" : "me")
            }
          />
          <div className="w-1/3 flex justify-center">
            <Label>Me</Label>
          </div>
          {/* <Button
            onClick={() => onAssigneeChange("everyone")}
            className={`flex-1 text-xs py-2 rounded-md transition-all duration-150 ${
              assigneeFilter === "everyone"
                ? "bg-white/6 text-white"
                : "text-slate-300 hover:bg-white/3"
            }`}
            aria-pressed={assigneeFilter === "everyone"}
          >
            Everyone
          </Button>

          <Button
            onClick={() => onAssigneeChange("me")}
            className={`flex-1 text-xs py-2 rounded-md transition-all duration-150 ${
              assigneeFilter === "me"
                ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                : "text-slate-300 hover:bg-white/3"
            }`}
            aria-pressed={assigneeFilter === "me"}
          >
            Assigned to me
          </Button> */}
        </div>
      </div>

      {/* Small legend / tips */}
      <div className="mt-4 text-xs text-slate-500">
        Tip: click a tasks to toggle. Use search to quickly find tasks.
      </div>
    </div>
  );
}

/*
Usage example:

<RightAsideFilters
  tasksFilter={tasksFilter}
  onTogglePriority={(p) => setPriorityFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
  assigneeFilter={assigneeFilter}
  onAssigneeChange={(v) => setAssigneeFilter(v)}
  onClear={() => { setPriorityFilter([]); setAssigneeFilter('everyone'); }}
/>
*/
