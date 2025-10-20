import { BoardState, Task, Columns, Member } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

function buildBoard(tasks: Task[]): BoardState {
  return {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  };
}

interface WorkspaceState {
  projectId: string;
  name: string;
  members: Member[];
  board: BoardState;
  tasks: Task[];
}

const initialState: WorkspaceState = {
  name: "",
  projectId: "",
  members: [],
  tasks: [
    // {
    //   id: "t-1",
    //   title: "D525252521",
    //   assignee: { name: ["Eli"] },
    //   priority: "High",
    //   status: "todo",
    //   createdAt: "Wed",
    // },
    // {
    //   id: "t-2",
    //   title: "Write 5215125 copy",
    //   assignee: { name: ["Maya"] },
    //   priority: "Medium",
    //   status: "todo",
    //   createdAt: "Fri",
    // },
    // {
    //   id: "t-3",
    //   title: "Realtime 5215125 (Yjs) POC",
    //   assignee: { name: ["Jon"] },
    //   priority: "High",
    //   status: "inprogress",
    //   createdAt: "Thu",
    // },
    // {
    //   id: "t-4",
    //   title: "Landing 512512 hero",
    //   assignee: { name: ["Eli"] },
    //   priority: "Low",
    //   status: "done",
    //   createdAt: "Yesterday",
    // },
  ],
  board: buildBoard([
    // {
    //   id: "t-1",
    //   title: "D525252521",
    //   assignee: { name: ["Eli"] },
    //   priority: "High",
    //   status: "todo",
    //   createdAt: "Wed",
    // },
    // {
    //   id: "t-2",
    //   title: "Write 5215125 copy",
    //   assignee: { name: ["Maya"] },
    //   priority: "Medium",
    //   status: "todo",
    //   createdAt: "Fri",
    // },
    // {
    //   id: "t-3",
    //   title: "Realtime 5215125 (Yjs) POC",
    //   assignee: { name: ["Jon"] },
    //   priority: "High",
    //   status: "inprogress",
    //   createdAt: "Thu",
    // },
    // {
    //   id: "t-4",
    //   title: "Landing 512512 hero",
    //   assignee: { name: ["Eli"] },
    //   priority: "Low",
    //   status: "done",
    //   createdAt: "Yesterday",
    // },
  ]),
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setProjectId(state, action) {
      state.projectId = action.payload.projectId;
    },
    setTasks(state, action) {
      state.tasks = action.payload.tasks;
      state.board = buildBoard(action.payload.tasks);
    },
    addTask(state, action) {
      state.tasks.push(action.payload.task);
      state.board = {
        ...state.board,
        todo: [action.payload.task, ...state.board.todo],
      };
    },
    editTask(state, action) {
      const newTask = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload.task : task
      );
      console.log("new tasksksk", newTask);
      state.tasks = newTask;
      state.board = buildBoard(newTask);
    },
    moveTask(
      state,
      action: {
        payload: { id: string; from: Columns; to: Columns; index?: number };
      }
    ) {
      const { id, from, to, index } = action.payload;

      const task = state.tasks.find((t) => t.id === id);
      if (!task) return;

      // remove from source column
      const newSource = (state.board[from as Columns] as Task[]).filter(
        (t: Task) => t.id !== id
      );
      // prepare moved task with new status
      const moved = { ...task, status: to };
      // insert into destination at clamped index
      const newDest = [...(state.board[to as Columns] as Task[])];
      const at = Math.min(Math.max(index ?? newDest.length, 0), newDest.length);
      newDest.splice(at, 0, moved);

      state.board = { ...state.board, [from]: newSource, [to]: newDest };

      // keep tasks in sync and preserve column order
      state.tasks = [
        ...state.board.todo,
        ...state.board.inprogress,
        ...state.board.done,
      ];
    },
    // editTaskStatus(state, action) {
    //   state.tasks = state.tasks.map((task) =>
    //     task.id === action.payload.id
    //       ? (() => {
    //           console.log({ ...task, status: action.payload.status });
    //           return { ...task, status: action.payload.status };
    //         })()
    //       : task
    //   );
    // },
    setBoard(state, action) {
      state.board = action.payload.board;

      state.tasks = [
        ...action.payload.board.todo,
        ...action.payload.board.inprogress,
        ...action.payload.board.done,
      ];
    },
    // setBoardState(state, action) {
    //   console.log("taskssss:", action.payload);
    //   state.board = buildBoard(action.payload);
    // },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
      state.board = buildBoard(state.tasks);
      localStorage.setItem("board", JSON.stringify(state.board));
      // state.board = {
      //   todo: state.tasks.filter((task) => task.status === "todo"),
      //   inprogress: state.tasks.filter((task) => task.status === "inprogress"),
      //   done: state.tasks.filter((task) => task.status === "done"),
      // };
    },
  },
});

export const {
  setProjectId,
  setTasks,
  addTask,
  editTask,
  deleteTask,
  setBoard,
  // editTaskStatus,
  moveTask,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
