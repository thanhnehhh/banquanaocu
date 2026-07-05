import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice/authSlice";
import cartSlice from "./cartSlice/cartSlice";
import chatSlice from "./chatSlice/chatSlice";
import socketSlice from "./socketSlice/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    chat: chatSlice.reducer,
    socket: socketSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
