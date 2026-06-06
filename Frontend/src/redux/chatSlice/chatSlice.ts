import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  conversationId: number | null;
  chatInfo: MessageChat | null;
}

export interface UserResponse {
  maNguoiDung: number;
  email: string;
}

export interface MessageChat {
  conversationId: number;
  conversationName: string;
  members: UserResponse[];
  isGroup: boolean;
  createAd: string;
  messages: Message[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface Message {
  id: number;
  content: string;
  sentAt: string;
  senderId: number;
  conversationId?: number;
}

const initialState: ChatState = {
  conversationId: null,
  chatInfo: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversationId: (state, action: PayloadAction<number>) => {
      state.conversationId = action.payload;
    },
    setChatList: (state, action: PayloadAction<MessageChat>) => {
      state.chatInfo = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (!state.chatInfo) return;
      state.chatInfo.messages.unshift(action.payload);
    },
    prependMessages: (state, action: PayloadAction<Message[]>) => {
      if (!state.chatInfo) return;
      state.chatInfo.messages = [...state.chatInfo.messages, ...action.payload];
    },
    clearChat: (state) => {
      state.conversationId = null;
      state.chatInfo = null;
    },
  },
});

export default chatSlice;
