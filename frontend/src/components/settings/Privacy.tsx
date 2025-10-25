"use client";

import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { useState } from "react";

export default function Privacy() {
  const [option, setOption] = useState<"public" | "private">("public");

  return (
    // <RadioGroup defaultValue="comfortable">
    <>
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
    </>
    // </RadioGroup>
  );
}
