export type Task = {
  id: string;
  title: string;
  assignee?: { name: string; initials: string; color?: string };
  priority?: "Low" | "Medium" | "High";
  due?: string;
};

export type Columns = "todo" | "inprogress" | "done";
export type BoardState = Record<Columns, Task[]>;
