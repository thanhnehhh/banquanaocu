import { Client } from "@stomp/stompjs";

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
    console.log(str);
  },

  onConnect: () => {
    console.log("WebSocket Connected");
  },

  onDisconnect: () => {
    console.log("WebSocket Disconnected");
  },

  onStompError: (frame) => {
    console.error("Broker error", frame);
  },
});
