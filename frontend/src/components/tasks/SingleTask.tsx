import { useState } from "react";
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
import { Dialog, DialogTrigger } from "@/components/ui/Dialog";
import DeleteModal from "./dropdownitems/DeleteModal";
import ViewModal from "./dropdownitems/ViewModal";
import ShareModal from "./dropdownitems/ShareModal";
import EditModal from "./dropdownitems/EditModal";

export default function SingleTask({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState<
    "view" | "edit" | "share" | "delete" | ""
  >();

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9" />
        <div>
          <div className="font-medium text-sm leading-tight">
            {task.title.length > 30
              ? task.title.slice(0, 30) + "..."
              : task.title}
          </div>
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
        <Dialog>
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
              <DialogTrigger className="[*>&]:w-full">
                <DropdownMenuItem onClick={() => setIsOpen("view")}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsOpen("edit")}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsOpen("share")}>
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => setIsOpen("delete")}
                >
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {isOpen === "delete" && <DeleteModal />}
          {isOpen === "view" && <ViewModal />}
          {isOpen === "share" && <ShareModal />}
          {isOpen === "edit" && <EditModal task={task} />}
        </Dialog>
      </div>
    </div>
  );
}
