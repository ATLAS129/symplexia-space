"use client";

import { Button } from "./ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "./ui/Card";

interface CardsInterface {
  id: number;
  title: string;
  description: string;
}

const initialCards = [
  {
    id: 1,
    title: "Finances",
    description: "calculating moneeey",
  },
  {
    id: 2,
    title: "Thoughts",
    description: "big ideasss",
  },
  {
    id: 3,
    title: "Library",
    description: "books for rich people lol",
  },
];

export default function DocumentsCards() {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
      {initialCards.map((card: CardsInterface) => (
        <Card
          key={card.id}
          className={`rounded-xl p-3 border bg-gradient-to-b from-black/60 to-black/30 shadow-md text-white`}
        >
          <CardHeader>
            <CardTitle className="">{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
            <CardAction>
              <Button variant="link">Open</Button>
            </CardAction>
          </CardHeader>
          <CardContent>IMAGE OF DOC</CardContent>
        </Card>
      ))}
    </div>
  );
}
