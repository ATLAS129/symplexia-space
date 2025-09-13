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

export default function EditModal() {
  return (
    <DialogOverlay onClick={(e) => {}}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>one moment</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  );
}
