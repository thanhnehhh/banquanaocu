import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingBag, Wallet, Info, CheckCheck, Trash2 } from "lucide-react";
import type { RootState } from "@/redux/store";
import {
  markAsRead,
  markAllAsRead,
  clearAll,
  type AppNotification,
  type NotificationType,
} from "@/redux/notificationSlice/notificationSlice";

const iconMap: Record<NotificationType, React.ReactNode> = {
  order: <ShoppingBag size={20} className="text-blue-500" />,
  product: <Package size={20} className="text-green-600" />,
  wallet: <Wallet size={20} className="text-yellow-500" />,
  system: <Info size={20} className="text-gray-500" />,
};

const categoryLabel: Record<NotificationType, string> = {
  order: "Mua",
  product: "Bán",
  wallet: "Ví",
  system: "Hệ thống",
};

const tabs = ["Tất cả", "Mua", "Bán", "Ví", "Hệ thống"] as const;
type Tab = (typeof tabs)[number];

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function UserNotification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state: RootState) => state.notification.items);
  const [activeTab, setActiveTab] = useState<Tab>("Tất cả");

  const filtered = notifications.filter((n) => {
    if (activeTab === "Tất cả") return true;
    return categoryLabel[n.type] === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClick = (item: AppNotification) => {
    dispatch(markAsRead(item.id));
    if (item.link) navigate(item.link);
  };

  return (
    <div className="py-16 px-12">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-slate-500">Trang chủ &gt; Thông báo</div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Thông báo
            {unreadCount > 0 && (
              <span className="ml-3 text-lg font-semibold text-[#49613E]">
                ({unreadCount} chưa đọc)
              </span>
            )}
          </h1>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="flex items-center gap-2 text-sm text-[#49613E] border border-[#49613E] px-4 py-2 rounded-full hover:bg-[#f0f7ec] transition-colors"
              >
                <CheckCheck size={15} /> Đọc tất cả
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => dispatch(clearAll())}
                className="flex items-center gap-2 text-sm text-red-500 border border-red-300 px-4 py-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} /> Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 rounded-3xl bg-[#F7FBF2] p-3 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-[#4E6A4E] text-white"
                  : "bg-white text-slate-700 shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách */}
      <div className="mt-8 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-[30px] bg-[#F7FBF2] p-8 text-center text-slate-500">
            Không có thông báo nào trong mục này.
          </div>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`w-full text-left rounded-[30px] p-6 shadow-sm transition hover:bg-[#EEF6E8] ${
                !item.isRead ? "bg-[#F0FAE8] border border-[#c8e6b0]" : "bg-[#F7FBF2]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D9E8CA] flex items-center justify-center shrink-0">
                  {iconMap[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className={`text-base ${!item.isRead ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#49613E]" />
                      )}
                      <span className="text-xs text-slate-400">{timeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  {item.link && (
                    <span className="mt-2 inline-block text-xs text-[#49613E] font-medium underline">
                      Xem chi tiết →
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default UserNotification;
