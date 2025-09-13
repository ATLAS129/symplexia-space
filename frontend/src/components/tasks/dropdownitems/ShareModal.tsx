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

export default function ShareModal() {
  return (
    <DialogContent className="sm:max-w-[425px] bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
      <DialogHeader>
        <DialogTitle>Share task</DialogTitle>
        <DialogDescription>Soon will be added</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button>Copy</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
