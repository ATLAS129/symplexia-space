import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useAppSelector } from "@/lib/hooks";
import { setTask } from "@/lib/states/workspaceSlice";
import { Task } from "@/types/types";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function EditModal({ task }: { task: Task }) {
  // const dispatch = useDispatch();
  // const tasks = useAppSelector((state) => state.workspace.tasks);

  // console.log(tasks);

  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">();

  // dispatch(setTask({ task: [{ id: task.id, title, assignee, priority }] }));
  // const saveTask = () => {
  //   dispatch(setTask({ task: { id: task.id, title, assignee, priority } }));
  // };

  return (
    <DialogOverlay>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>Edit title, assignee, priority</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="assignee">Assignee</Label>
            <Input id="assignee" name="assignee" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="priority">Priority</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  );
}
