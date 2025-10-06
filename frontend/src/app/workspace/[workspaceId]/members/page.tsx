"use client";
import React, { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
import RightAside from "@/components/RightAside";
import { X } from "lucide-react";
import MemberCard from "@/components/members/MemberCard";
import { Member, Role } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Eli Larson",
    email: "eli@acme.com",
    role: "Owner",
    initials: "EL",
  },
  {
    id: "2",
    name: "Maya Kim",
    email: "maya@acme.com",
    role: "Editor",
    initials: "MK",
  },
  {
    id: "3",
    name: "Jon Doe",
    email: "jon@Doe.com",
    role: "Viewer",
    initials: "JD",
  },
];

export default function MembersPage() {
  // state
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const membersState = useAppSelector((state) => state.workspace.members);
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role[]>([]);

  // invite modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Viewer");
  const [inviteError, setInviteError] = useState<string | null>(null);

  // CSV import modal
  // const [csvOpen, setCsvOpen] = useState(false);
  // const [csvPreview, setCsvPreview] = useState<Member[] | null>(null);
  // const fileRef = useRef<HTMLInputElement | null>(null);

  // search + filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (roleFilter.length !== 0 && !roleFilter.includes(m.role)) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.initials ?? "").toLowerCase().includes(q)
      );
    });
  }, [members, query, roleFilter]);

  /* ---------------- actions ---------------- */

  /* ---------------- invite ---------------- */
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

  /* ---------------- CSV bulk import (client preview) ---------------- */
  // const onCsvSelect = useCallback((file?: File | null) => {
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const text = String(e.target?.result ?? "");
  //     const lines = text
  //       .split(/\r?\n/)
  //       .map((l) => l.trim())
  //       .filter(Boolean);
  // Expect CSV with header: name,email,role (role optional)
  // const parsed: Member[] = lines
  //   .slice(1)
  //   .map((line) => {
  //     const [name = "", email = "", role = "Viewer"] = line
  //       .split(",")
  //       .map((c) => c.trim());
  //     return {
  //       id: String(Math.floor(Math.random() * 100)),
  //       name,
  //       email,
  //       role: ["Owner", "Admin", "Editor", "Viewer"].includes(role)
  //         ? (role as Role)
  //         : "Viewer",
  //       initials: name
  //         .split(" ")
  //         .map((s) => s[0])
  //         .slice(0, 2)
  //         .join("")
  //         .toUpperCase(),
  //       invited: true,
  //     };
  //   })
  //   .filter((m) => m.email && m.name);
  // setCsvPreview(parsed.length ? parsed : null);
  // setCsvOpen(true);
  //   };
  //   reader.readAsText(file);
  // }, []);

  // const applyCsvImport = useCallback(() => {
  //   if (!csvPreview || csvPreview.length === 0) return;
  //   // dedupe by email
  //   const existing = new Set(members.map((m) => m.email.toLowerCase()));
  //   const toAdd = csvPreview.filter(
  //     (c) => !existing.has(c.email.toLowerCase())
  //   );
  //   if (toAdd.length === 0) {
  //     alert("No new members found in the CSV (duplicates skipped).");
  //   } else {
  //     setMembers((prev) => [...toAdd, ...prev]);
  //     alert(`Imported ${toAdd.length} members (duplicates skipped).`);
  //   }
  //   setCsvPreview(null);
  //   setCsvOpen(false);
  //   if (fileRef.current) fileRef.current.value = "";
  // }, [csvPreview, members]);

  /* ---------------- small UI helpers ---------------- */
  const countByRole = useMemo(() => {
    return members.reduce(
      (acc, m) => {
        acc.total += 1;
        acc[
          m.role.toLowerCase() as "owner" | "admin" | "editor" | "viewer"
        ] += 1;
        return acc;
      },
      { total: 0, owner: 0, admin: 0, editor: 0, viewer: 0 }
    );
  }, [members]);

  return (
    <>
      <section className="flex-1 p-6">
        <div>
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Members
              </h1>
              <p className="mt-1 text-slate-400 text-xs">
                Manage roles, invitations, and activity for your team.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="text-sm text-slate-400">
                      Total {countByRole.total}
                    </div>
                    <div className=" text-red-300">
                      Owner {countByRole.owner}
                    </div>
                    <div className="text-amber-300">
                      Admin {countByRole.admin}
                    </div>
                    <div className="text-emerald-300">
                      Editor {countByRole.editor}
                    </div>
                    <div className="text-slate-400">
                      Viewer {countByRole.viewer}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email or initials"
                  className="w-72 bg-white/3 placeholder:text-slate-400"
                />
              </div>

              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
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
                      <Button
                        variant="ghost"
                        onClick={() => setInviteOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button onClick={onInvite}>Send invite</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    // ref={fileRef as any}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    // onChange={(e) => {
                    //   const f = e.target.files?.[0] ?? null;
                    //   onCsvSelect(f || undefined);
                    // }}
                  />
                  {/* <Button
                    // onClick={() =>
                    //   (fileRef.current as HTMLInputElement | null)?.click()
                    // }
                    variant="outline"
                  >
                    Import CSV
                  </Button> */}
                </label>
              </div>
            </div>
          </div>

          {/* Main content area: two-column responsive layout */}
          {filtered.length === 0 ? (
            <div className="w-full h-25 rounded-2xl bg-white/3 p-8 text-center text-slate-400">
              No members found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((member) => (
                // Center: member cards
                <MemberCard
                  key={member.id}
                  member={member}
                  setMembers={setMembers}
                />
              ))}
            </div>
          )}

          {/* Footer / helpers */}
          {/* <div className="mt-6 rounded-2xl bg-white/3 p-4 border border-white/6 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Need enterprise features? Add SSO, role templating, or audit logs.
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => alert("Open role audit (stub)")}
              >
                Role audit
              </Button>
              <Button onClick={() => alert("Export CSV (stub)")}>
                Export CSV
              </Button>
            </div>
          </div> */}
        </div>
        {/* CSV preview dialog (simple) */}
        {/* <Dialog open={csvOpen} onOpenChange={setCsvOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>CSV Import Preview</DialogTitle>
            <DialogDescription>
              Preview parsed CSV rows — duplicates will be skipped on import.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3 max-h-72 overflow-auto">
            {!csvPreview ? (
              <div className="text-sm text-slate-400">No CSV loaded.</div>
            ) : (
              csvPreview.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-md p-2 bg-white/4"
                >
                  <div>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-slate-400">
                      {c.email} • {c.role}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {c.invited ? "Invited" : "New"}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="ghost" onClick={() => setCsvOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyCsvImport}>
              Import {csvPreview ? `(${csvPreview.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      </section>

      {/* Right sidebar */}
      <RightAside>
        <div className="py-4 px-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-slate-300">Filters</div>
              <div className="text-xs text-slate-400">
                Show members by roles
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-8 w-8 p-1 rounded-md text-slate-400 hover:bg-white/5"
                onClick={() => setRoleFilter([])}
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex justify-evenly">
            <Button
              className={`w-1/5 px-4 py-3 rounded-xl bg-white/6 ${
                roleFilter.includes("Owner")
                  ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                  : ""
              }`}
              onClick={() =>
                roleFilter.includes("Owner")
                  ? setRoleFilter(roleFilter.filter((r) => r !== "Owner"))
                  : setRoleFilter([...roleFilter, "Owner"])
              }
            >
              Owner
            </Button>
            <Button
              className={`w-1/5 px-4 py-3 rounded-xl bg-white/6 ${
                roleFilter.includes("Admin")
                  ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                  : ""
              }`}
              onClick={() =>
                roleFilter.includes("Admin")
                  ? setRoleFilter(roleFilter.filter((r) => r !== "Admin"))
                  : setRoleFilter([...roleFilter, "Admin"])
              }
            >
              Admin
            </Button>
            <Button
              className={`w-1/5 px-4 py-3 rounded-xl bg-white/6 ${
                roleFilter.includes("Editor")
                  ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                  : ""
              }`}
              onClick={() =>
                roleFilter.includes("Editor")
                  ? setRoleFilter(
                      roleFilter.filter((r) => r !== "Editor") as Role[]
                    )
                  : setRoleFilter([...roleFilter, "Editor"])
              }
            >
              Editor
            </Button>
            <Button
              className={`w-1/5 px-4 py-3 rounded-xl bg-white/6 ${
                roleFilter.includes("Viewer")
                  ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                  : ""
              }`}
              onClick={() =>
                roleFilter.includes("Viewer")
                  ? setRoleFilter(roleFilter.filter((r) => r !== "Viewer"))
                  : setRoleFilter([...roleFilter, "Viewer"])
              }
            >
              Viewer
            </Button>
          </div>
        </div>
      </RightAside>
    </>
  );
}
