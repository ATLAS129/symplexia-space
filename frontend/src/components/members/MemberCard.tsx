import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Member, Role } from "@/types/types";
import { Button } from "../ui/Button";
import { useCallback } from "react";

export default function MemberCard({
  member,
  setMembers,
}: {
  member: any;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}) {
  const changeRole = useCallback((id: string, newRole: Role) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  }, []);

  const removeMember = useCallback((id: string) => {
    if (!confirm("Remove member from workspace?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const promoteToOwner = useCallback((id: string) => {
    if (
      !confirm(
        "Make this member the workspace owner? Current owner will become Editor."
      )
    )
      return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, role: "Owner" }
          : m.role === "Owner"
          ? { ...m, role: "Editor" }
          : m
      )
    );
  }, []);

  return (
    <article
      key={member.id}
      className="rounded-2xl bg-gradient-to-b from-black/50 to-black/30 border border-white/6 p-4 transition hover:scale-[1.01]"
    >
      <div className="flex justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12" />
          <div>
            <div className="font-semibold text-lg">{member.name}</div>
            <div className="text-xs text-slate-400">{member.email}</div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2">
          <Badge
            className={`${
              member.role === "Owner"
                ? "bg-red-500 text-white"
                : member.role === "Admin"
                ? "bg-green-500 text-white"
                : member.role === "Editor"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {member.role}
          </Badge>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(v) => changeRole(member.id, v as Role)}
            defaultValue={member.role}
          >
            <SelectTrigger className="text-sm">
              <SelectValue>{member.role}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owner">Owner</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          {member.invited ? (
            <div className="px-2 py-1 rounded-md text-xs text-amber-300 bg-amber-900/10">
              Invited
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {member.role !== "Owner" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => promoteToOwner(member.id)}
            >
              Make owner
            </Button>
          ) : (
            <div className="text-xs text-slate-400">Workspace owner</div>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeMember(member.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}
