import axiosClient from "@/service/axiosClient";

export interface CreateConversationPayload {
  memberIds: number[];
  name?: string;
  isGroup?: boolean;
}

// Tạo cuộc trò chuyện mới (1-1 hoặc group)
export const createConversation = (payload: CreateConversationPayload) =>
  axiosClient.post("/conversations", payload);

// Lấy danh sách cuộc trò chuyện của user hiện tại
export const getConversations = () => axiosClient.get("/conversations");

// Lấy chi tiết cuộc trò chuyện + tin nhắn (có phân trang)
export const getConversationDetail = (conversationId: number, page = 0, size = 20) =>
  axiosClient.get(`/conversations/${conversationId}`, { params: { page, size } });

// Shortcut: mở chat 1-1 với một user (dùng maNguoiDung)
export const chatWithUser = (targetUserId: number) =>
  createConversation({ memberIds: [targetUserId], isGroup: false });

// Shortcut: mở chat với seller/buyer qua email
export const chatWithSeller = (emailOpponent: string) =>
  axiosClient.post("/conversations", { emailOpponent });

export const chatWithBuyer = (emailOpponent: string) =>
  axiosClient.post("/conversations", { emailOpponent });
