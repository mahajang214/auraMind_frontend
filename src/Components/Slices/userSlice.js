import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("jwtToken");
      state.isAuthenticated = false;
    },
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload; // recommended
    },
  },
});

export const { setUser, logout,setAuth } = userSlice.actions;
export default userSlice.reducer;
