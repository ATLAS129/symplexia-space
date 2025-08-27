"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({
  label,
  workspaceId,
}: {
  label: string;
  workspaceId: string;
}) {
  const pathName = usePathname();

  return (
    <Link
      className="flex items-center"
      href={`/workspace/${workspaceId}/${label.toLowerCase()}`}
    >
      <div
        className={`w-full px-3 py-2 rounded-lg flex items-center gap-3 cursor-pointer ${
          pathName.slice(1).replace(`workspace/${workspaceId}/`, "") ===
          label.toLowerCase()
            ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
            : "hover:bg-white/5"
        }`}
      >
        <div className="w-9 h-9 rounded-lg bg-white/6 grid place-items-center text-sm">
          {label[0]}
        </div>
        <div className="text-sm">{label}</div>
      </div>
    </Link>
  );
}
