import { createSlice } from "@reduxjs/toolkit";

const loggedRoleSlice = createSlice({
  name: "loggedRole",
  initialState: "",
  reducers: {
    setRole: (state, action) => action.payload,
    clearRole: () => ""
  }
})

export const { setRole, clearRole } = loggedRoleSlice.actions;
export default loggedRoleSlice.reducer;