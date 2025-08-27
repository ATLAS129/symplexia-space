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
          className="w-full h-full rounded-xl border-slate-800 bg-gradient-to-b from-black/60 to-black/30 shadow-md text-white"
        >
          <CardHeader>
            <div className="flex gap-2 items-center">
              <Avatar className="w-9 h-9" />
              <div className="flex flex-col justify-center">
                <CardTitle className="flex items-center gap-3">
                  {card.title}
                </CardTitle>
                <CardDescription></CardDescription>
              </div>
            </div>

            <CardAction>
              <Link href={`documents/${card.id}`}>
                <Button variant="default">Open</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>{card.description}</CardContent>
          <CardFooter className="flex justify-end items-end">
            <div className="text-xs text-slate-400">
              {(() => {
                const d = new Date(card.createdAt);
                const now = new Date();
                const msPerDay = 24 * 60 * 60 * 1000;
                const midnight = (t: Date) =>
                  new Date(t.getFullYear(), t.getMonth(), t.getDate());
                const diffDays = Math.round(
                  (midnight(now).getTime() - midnight(d).getTime()) / msPerDay
                );
                const oneYear = 365 * msPerDay;
                const time = d.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const dateLabel =
                  now.getTime() - d.getTime() > oneYear
                    ? d.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : diffDays === 0
                    ? "Today"
                    : diffDays === 1
                    ? "Yesterday"
                    : d.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      });

                return `${dateLabel}, ${time}`;
              })()}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
