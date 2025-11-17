import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slices/userSlice.js";
import activeTrackReducer from '../Slices/activeTrackSlice.js'

export const store = configureStore({
  reducer: {
    user: userReducer,
    activeTrack: activeTrackReducer,
  },
});
