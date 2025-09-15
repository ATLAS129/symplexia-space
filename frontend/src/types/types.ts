export type Task = {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  assignee?: { name: string[] };
  priority?: "Low" | "Medium" | "High";
  createdAt?: string;
  updatedAt?: string;
  // project     Project  @relation(fields: [projectId], references: [id])
};

export type TasksFilter =
  | "mine"
  | "highPriority"
  | "mediumPriority"
  | "lowPriority"
  | "dueSoon"
  | "createdToday";

export type Document = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
};

export type Columns = "todo" | "inprogress" | "done";
export type BoardState = Record<Columns, Task[]>;
