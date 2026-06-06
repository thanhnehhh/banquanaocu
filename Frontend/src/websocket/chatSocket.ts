import { stompClient } from "./stompClient";

export const connectSocket = () => {
  if (!stompClient.active) {
    stompClient.activate();
  }
};

export const disconnectSocket = () => {
  if (stompClient.active) {
    stompClient.deactivate();
  }
};

export const subscribeConversation = (
  conversationId: number,
  callback: (message: any) => void,
) => {
  return stompClient.subscribe(
    `/topic/conversation/${conversationId}`,
    (message) => {
      callback(JSON.parse(message.body));
    },
  );
};

export const sendMessage = (message: any) => {
  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message),
  });
};
