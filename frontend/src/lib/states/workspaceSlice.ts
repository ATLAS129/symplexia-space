import { Task } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface WorkspaceState {
  name: string;
  members: string[];
  tasks: Task[];
}

const initialState: WorkspaceState = {
  name: "",
  members: [],
  tasks: [],
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    // getTasks(state, action) {
    //   try {
    //     const raw = localStorage.getItem("board");
    //     state.tasks = raw;
    //   } catch (e) {
    //     return null;
    //   }
    // },
  },
});

// export const { getTasks } = workspaceSlice.actions;
export default workspaceSlice.reducer;
