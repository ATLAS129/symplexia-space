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
} from "./ui/Card";

interface Cards {
  id: number;
  title: string;
  description: string;
}

export default function DocumentsCards({
  initialCards,
}: {
  initialCards: Cards[];
}) {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
      {initialCards?.map((card: Cards) => (
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
        </Card>
      ))}
    </div>
  );
}
