import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { deleteTask } from "@/lib/states/workspaceSlice";
import { Task } from "@/types/types";
import { useDispatch } from "react-redux";

export default function DeleteModal({ task }: { task: Pick<Task, "id"> }) {
  const dispatch = useDispatch();
  return (
    <DialogContent
      className="sm:max-w-[425px] bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none"
      showCloseButton={false}
    >
      <DialogHeader>
        <DialogTitle>Delete task</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this task?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="destructive"
            onClick={() => dispatch(deleteTask({ id: task.id }))}
          >
            Delete
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
