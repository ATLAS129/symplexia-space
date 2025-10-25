"use client";

import { Label } from "@/components/ui/Label";
import { useState } from "react";

export function SecuritySettings() {
  const [option, setOption] = useState<"public" | "private">("public");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-slate-400 font-semibold text-sm">
        Workpsace visibility
      </h2>
      <div className="flex items-center gap-3">
        <input
          title="public"
          value="public"
          id="public"
          type="radio"
          checked={option === "public"}
          onChange={() => setOption("public")}
        />
        <Label htmlFor="public">Public</Label>
      </div>
      <div className="flex items-center gap-3">
        <input
          title="private"
          value="private"
          id="private"
          type="radio"
          checked={option === "private"}
          onChange={() => setOption("private")}
        />
        <Label htmlFor="private">Private</Label>
      </div>
    </div>
  );
}
