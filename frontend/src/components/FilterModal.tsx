import React, { useEffect, useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/Dialog";
import { TasksFilter } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Checkbox } from "./ui/Checkbox";
import { Label } from "./ui/Label";

function FilterModal({
  tasksFilter,
  setTasksFilter,
}: {
  tasksFilter: TasksFilter[];
  setTasksFilter: React.Dispatch<React.SetStateAction<TasksFilter[]>>;
}) {
  const [localFilter, setLocalFilter] = useState<TasksFilter[]>();

  useEffect(() => {
    setLocalFilter(tasksFilter);
  }, [tasksFilter]);

  console.log("tasksFilter", tasksFilter, "local", localFilter);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-b from-indigo-600 to-indigo-500">
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
          <DialogDescription>
            Filter by assignee, due date, priority, and more.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex justify-between items-center">
            <h2>By priority</h2>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="terms"
                  checked={localFilter?.includes("lowPriority")}
                  onCheckedChange={() =>
                    setLocalFilter((prev) =>
                      prev?.includes("lowPriority")
                        ? prev.filter((f) => f !== "lowPriority")
                        : [...prev, "lowPriority"]
                    )
                  }
                />
                <Label htmlFor="terms">Low</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="terms-2"
                  checked={localFilter?.includes("mediumPriority")}
                  onCheckedChange={() =>
                    setLocalFilter((prev) =>
                      prev?.includes("mediumPriority")
                        ? prev.filter((f) => f !== "mediumPriority")
                        : [...prev, "mediumPriority"]
                    )
                  }
                />
                <Label htmlFor="terms-2">Medium</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="terms-3"
                  checked={localFilter?.includes("highPriority")}
                  onCheckedChange={() =>
                    setLocalFilter((prev) =>
                      prev?.includes("highPriority")
                        ? prev.filter((f) => f !== "highPriority")
                        : [...prev, "highPriority"]
                    )
                  }
                />
                <Label htmlFor="terms-3">High</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => setTasksFilter(localFilter ? localFilter : [])}
            >
              Apply
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(FilterModal);
