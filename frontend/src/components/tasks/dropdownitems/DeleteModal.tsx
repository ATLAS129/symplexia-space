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

export default function DeleteModal() {
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
          <Button variant="destructive">Delete</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
