import { Task } from "@/types/types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export default function SingleTask({ task }: { task: Task }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9" />
        <div>
          <div className="font-medium text-sm leading-tight">{task.title}</div>
          <div className="text-xs text-slate-400 mt-1">
            {task.assignee?.name ?? "Unassigned"} · {task.createdAt ?? "No due"}
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="text-xs select-none cursor-pointer">⋯</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {task.title.length > 10
                ? task.title.slice(0, 10) + "..."
                : task.title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
