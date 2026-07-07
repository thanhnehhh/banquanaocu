import { useEffect, useRef, useState } from "react";
import { Bell, Package, ShoppingBag, Wallet, Info, X, CheckCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import {
  markAsRead,
  markAllAsRead,
  clearAll,
  type AppNotification,
  type NotificationType,
} from "@/redux/notificationSlice/notificationSlice";

const iconMap: Record<NotificationType, React.ReactNode> = {
  order: <ShoppingBag size={16} className="text-blue-500" />,
  product: <Package size={16} className="text-green-600" />,
  wallet: <Wallet size={16} className="text-yellow-500" />,
  system: <Info size={16} className="text-gray-500" />,
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications = useSelector((state: RootState) => state.notification.items);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (item: AppNotification) => {
    dispatch(markAsRead(item.id));
    if (item.link) navigate(item.link);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-gray-700 hover:text-black transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-[3px]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] z-50 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-sm text-gray-800">
              Thông báo {unreadCount > 0 && <span className="text-[#49613E]">({unreadCount})</span>}
            </span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllAsRead())}
                  className="text-xs text-[#49613E] hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={13} /> Đọc tất cả
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => dispatch(clearAll())}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Danh sách */}
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                Chưa có thông báo nào
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[#F4FBEE] transition-colors border-b border-gray-50 last:border-0 ${
                    !item.isRead ? "bg-[#F7FFF2]" : ""
                  }`}
                >
                  <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {iconMap[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!item.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(item.createdAt)}</p>
                  </div>
                  {!item.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#49613E] shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2">
              <button
                onClick={() => { navigate("/profile/notifications"); setOpen(false); }}
                className="text-xs text-[#49613E] hover:underline font-medium w-full text-center"
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
