import { BoardState, Task } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface WorkspaceState {
  name: string;
  members: string[];
  tasks: BoardState;
}

const initialState: WorkspaceState = {
  name: "",
  members: [],
  tasks: { todo: [], inprogress: [], done: [] },
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setTask(state, action) {
      state.tasks.done = action.payload.task;
    },
  },
});

export const { setTask } = workspaceSlice.actions;
export default workspaceSlice.reducer;
