import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "order" | "product" | "system" | "wallet";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  link?: string;       // route để navigate khi click
  isRead: boolean;
  createdAt: string;   // ISO string
}

interface NotificationState {
  items: AppNotification[];
}

// Khởi tạo từ localStorage để persist qua reload
const loadFromStorage = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem("notifications");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: AppNotification[]) => {
  try {
    localStorage.setItem("notifications", JSON.stringify(items.slice(0, 50)));
  } catch {}
};

const initialState: NotificationState = {
  items: loadFromStorage(),
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<AppNotification, "id" | "isRead" | "createdAt">>) => {
      const newItem: AppNotification = {
        ...action.payload,
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newItem);
      // Giữ tối đa 50 thông báo
      if (state.items.length > 50) state.items = state.items.slice(0, 50);
      saveToStorage(state.items);
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.isRead = true;
      saveToStorage(state.items);
    },

    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.isRead = true));
      saveToStorage(state.items);
    },

    clearAll: (state) => {
      state.items = [];
      localStorage.removeItem("notifications");
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearAll } = notificationSlice.actions;
export default notificationSlice;
