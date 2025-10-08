import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useCallback, useState } from "react";
import { Member, Role } from "@/types/types";
import { useAppSelector } from "@/lib/hooks";

export default function InviteModal({
  members,
  setMembers,
}: {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}) {
  const projectId = useAppSelector((state) => state.workspace.projectId);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Viewer");
  const [inviteError, setInviteError] = useState<string | null>(null);

  const onInvite = useCallback(() => {
    setInviteError(null);
    const email = inviteEmail.trim();
    const name = inviteName.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError("Please provide a valid email.");
      return;
    }
    if (!name) {
      setInviteError("Please provide the member's name.");
      return;
    }
    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      setInviteError("This email is already a member or invited.");
      return;
    }

    const newMember: Member = {
      id: String(Math.floor(Math.random() * 100)),
      name,
      email,
      role: inviteRole,
      initials: name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      invited: true,
    };

    setMembers((prev) => [newMember, ...prev]);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Viewer");
    setInviteOpen(false);
  }, [inviteEmail, inviteName, inviteRole, members]);

  return (
    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">Invite</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gradient-to-r from-slate-950 to-slate-900 text-white border-none">
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>
            Send an invite via email and assign a role.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <label className="text-xs text-slate-400">Full name</label>
          <Input
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            placeholder="Ava Johnson"
          />

          <label className="text-xs text-slate-400">Email</label>
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="ava@company.com"
          />

          <label className="text-xs text-slate-400">Role</label>
          <Select
            onValueChange={(v) => setInviteRole(v as Role)}
            defaultValue={inviteRole}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{inviteRole}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owner">Owner</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          {inviteError ? (
            <div className="text-xs text-rose-400">{inviteError}</div>
          ) : null}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onInvite}>Send invite</Button>
        </DialogFooter>
        <DialogHeader>
          <DialogTitle>Or share invite link</DialogTitle>
          <DialogDescription>
            This link can be used to request joining your team directly.
          </DialogDescription>
        </DialogHeader>
        <h2 className="text-center font-semibold">{`https://localhost:3000/workspace/${projectId}/invite`}</h2>
        <DialogClose asChild>
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                `https://localhost:3000/workspace/${projectId}/invite`
              )
            }
          >
            Copy link
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
