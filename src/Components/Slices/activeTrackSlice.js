// src/redux/slices/activeTrackSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTrack: null,   // stores the currently selected or playing track

};

const activeTrackSlice = createSlice({
  name: "activeTrack",
  initialState,
  reducers: {
    setActiveTrack: (state, action) => {
      state.activeTrack = action.payload;
    },
    clearActiveTrack: (state) => {
      state.activeTrack = null;
    },
    
  },
});

export const { setActiveTrack, clearActiveTrack } =
  activeTrackSlice.actions;

export default activeTrackSlice.reducer;
