import { BoardState, Columns, Task } from "@/types/types";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import SingleTask from "./SingleTask";

const COLUMN_ORDER: Columns[] = ["todo", "inprogress", "done"];

export default function Board({ board }: { board: BoardState }) {
  return (
    <div className="rounded-xl">
      <div className="flex justify-between flex-col md:flex-row gap-6">
        {COLUMN_ORDER.map((colId) => {
          const columnTasks = board[colId];
          return (
            <div
              role="list"
              key={colId}
              className={`min-h-[220px] p-2 rounded-lg w-full md:w-1/3 flex flex-col`}
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

              <div className="flex flex-col gap-3 flex-1">
                {columnTasks.length === 0 ? (
                  <div className="rounded-lg p-4 border border-dashed border-white/6 text-slate-400 text-sm">
                    No tasks yet — drop here or create one
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      role="listitem"
                      tabIndex={0}
                      className={`rounded-xl p-3 border border-slate-800 bg-gradient-to-b from-black/60 to-black/30 shadow-md transition hover:scale-[1.01]`}
                    >
                      <SingleTask task={task} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
