import React from "react";

export default function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      className={`px-3 py-2 rounded-lg flex items-center gap-3 cursor-pointer ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
          : "hover:bg-white/5"
      }`}
      onClick={onClick}
    >
      <div className="w-9 h-9 rounded-lg bg-white/6 grid place-items-center text-sm">
        {label[0]}
      </div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
