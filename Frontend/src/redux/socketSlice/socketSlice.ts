import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",

  initialState: {
    connected: false,
  },

  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export default socketSlice;
