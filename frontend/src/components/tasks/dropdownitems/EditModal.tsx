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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { editTask, setTasks } from "@/lib/states/workspaceSlice";
import { Task } from "@/types/types";
import { useState } from "react";

export default function EditModal({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.workspace.tasks);

  // console.log(tasks);

  const [title, setTitle] = useState(task.title);
  const [assignee, setAssignee] = useState(task.assignee?.name);
  const [priority, setPriority] = useState(task.priority);

  // dispatch(setTask({ task: [{ id: task.id, title, assignee, priority }] }));
  // const saveTask = () => {
  //   dispatch(setTask({ task: { id: task.id, title, assignee, priority } }));
  // };

  const saveTask = () => {
    dispatch(
      editTask({
        id: task.id,
        task: { ...task, title, assignee: { name: assignee }, priority },
      })
    );
  };

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
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              name="assignee"
              value={assignee}
              onChange={(e) => setAssignee([e.target.value])}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="priority">Priority</Label>
            <Select
              onValueChange={(e) => setPriority(e as "Low" | "Medium" | "High")}
              defaultValue={priority}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
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
            <Button onClick={saveTask}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  );
}
