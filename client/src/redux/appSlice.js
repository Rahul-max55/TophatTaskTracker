import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      if (state.darkMode === false) {
        state.darkMode = true;
      } else {
        state.darkMode = false;
      }
    },
  },
});

export const { toggleDarkMode } = appSlice.actions;

export default appSlice.reducer;
