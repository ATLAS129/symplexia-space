import { BoardState, Columns, Task } from "@/types/types";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";

const COLUMN_ORDER: Columns[] = ["todo", "inprogress", "done"];

export default function Board({ board }: { board: BoardState }) {
  return (
    <div className="rounded-xl p-4">
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
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9" />
                          <div>
                            <div className="font-medium text-sm leading-tight">
                              {task.title}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {task.assignee?.name ?? "Unassigned"} ·{" "}
                              {task.createdAt ?? "No due"}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            className={
                              "text-xs " +
                              (task.priority === "High"
                                ? "bg-red-600/20 text-red-400"
                                : task.priority === "Medium"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : task.priority === "Low"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-slate-600/20 text-slate-400")
                            }
                          >
                            {task.priority ?? "—"}
                          </Badge>
                          <div className="text-xs text-slate-400">⋯</div>
                        </div>
                      </div>
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
