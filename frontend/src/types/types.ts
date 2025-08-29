export type Task = {
  id: string;
  title: string;
  assignee?: { name: string; initials: string; color?: string };
  priority?: "Low" | "Medium" | "High";
  createdAt?: string;
};

export type Document = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
};

export type Columns = "todo" | "inprogress" | "done";
export type BoardState = Record<Columns, Task[]>;
