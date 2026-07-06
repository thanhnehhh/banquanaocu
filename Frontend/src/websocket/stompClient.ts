import { Client } from "@stomp/stompjs";
import { store } from "../redux/store";
import socketSlice from "@/redux/socketSlice/socketSlice";

export const stompClient = new Client({
  brokerURL: "ws://localhost:8080/app_socket",

  reconnectDelay: 5000,

  beforeConnect: async () => {
    const token = localStorage.getItem("token");
    stompClient.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };
  },

  debug: (str) => {
    if (import.meta.env.DEV) {
      console.log("[STOMP]", str);
    }
  },

  onConnect: () => {
    console.log("[WebSocket] Connected");
    store.dispatch(socketSlice.actions.setConnected(true));
  },

  onDisconnect: () => {
    console.log("[WebSocket] Disconnected");
    store.dispatch(socketSlice.actions.setConnected(false));
  },

  onWebSocketClose: (event) => {
    console.log("[WebSocket] Closed", event);
    store.dispatch(socketSlice.actions.setConnected(false));
  },

  onWebSocketError: (event) => {
    console.error("[WebSocket] Error", event);
    store.dispatch(socketSlice.actions.setConnected(false));
  },

  onStompError: (frame) => {
    console.error("[WebSocket] Broker error", frame);
    store.dispatch(socketSlice.actions.setConnected(false));
  },
});
