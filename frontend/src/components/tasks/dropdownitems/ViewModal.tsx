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
import { Task } from "@/types/types";

export default function ViewModal({ task }: { task: Task }) {
  return (
    <DialogContent className="sm:max-w-[425px] bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
      <DialogHeader>
        <DialogTitle>View task</DialogTitle>
        <DialogDescription>No view currently</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
