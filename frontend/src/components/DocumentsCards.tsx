"use client";

import Link from "next/link";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "./ui/Card";
import { Document } from "@/types/types";

export default function DocumentsCards({
  documents,
}: {
  documents: Document[];
}) {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
      {documents?.map((card: Document) => (
        <Card
          key={card.id}
          className={`rounded-xl border-slate-800 bg-gradient-to-b from-black/60 to-black/30 shadow-md text-white`}
        >
          <CardHeader>
            <div className="flex gap-2 items-center">
              <Avatar className="w-9 h-9" />
              <div className="flex flex-col justify-center">
                <CardTitle className="flex items-center gap-3">
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </div>
            </div>

            <CardAction>
              <Button variant="default">
                <Link href="/workspace/document">Open</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>IMAGE OF DOC</CardContent>
          <CardFooter className="flex justify-end items-end">
            <div className="text-xs text-slate-400">
              {(() => {
                const d = card.createdAt;
                const now = new Date();
                const oneYearMs = 365 * 24 * 60 * 60 * 1000;
                const time = d.toTimeString().slice(0, 5);
                const date =
                  now.getTime() - d.getTime() > oneYearMs
                    ? d.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : d.toDateString() === now.toDateString()
                    ? "Today"
                    : d.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      });
                return `${date}, ${time}`;
              })()}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
