import { Client } from "@stomp/stompjs";

// Spring Boot WebSocket hỗ trợ cả SockJS (/app_socket) và native WS (/app_socket/websocket)
// Dùng native WebSocket URL để tránh phụ thuộc sockjs-client trong Vite ESM
const WS_URL = "ws://localhost:8080/app_socket/websocket";

export const stompClient = new Client({
  brokerURL: WS_URL,
  reconnectDelay: 5000,

  beforeConnect: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      stompClient.connectHeaders = {
        Authorization: `Bearer ${token}`,
      };
    }
  },

  debug: (str) => {
    if (import.meta.env.DEV) {
      console.log("[STOMP]", str);
    }
  },

  onConnect: () => {
    console.log("[WebSocket] Connected");
  },

  onDisconnect: () => {
    console.log("[WebSocket] Disconnected");
  },

  onStompError: (frame) => {
    console.error("[WebSocket] Broker error", frame);
  },
});
