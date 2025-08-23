import { Task } from "@/types/types";

export default function DragPreview({ task }: { task?: Task }) {
  if (!task) return null;
  return (
    <div className="w-72 rounded-xl p-3 bg-gradient-to-b from-indigo-600/60 to-pink-500/30 text-white shadow-2xl">
      <div className="font-medium">{task.title}</div>
      <div className="text-xs mt-1 opacity-80">
        {task.assignee?.name ?? "Unassigned"}
      </div>
    </div>
  );
}
