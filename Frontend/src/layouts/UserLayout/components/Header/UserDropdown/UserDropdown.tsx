import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User, MessageCircle, Landmark, TicketCheck, Bell, CirclePlus, List, Van, Heart, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import authSlice from "@/redux/authSlice/authSlice";
import { resetCart } from "@/redux/cartSlice/cartSlice";
import { useState } from "react";
import Loading from "@/components/common/Loading";
import { disconnectSocket } from "@/websocket/chatSocket";

interface UserDropdownProps {
  user: { name?: string; email: string; };
}

const UserDropdown = ({ user }: UserDropdownProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    fetch(import.meta.env.VITE_API_MAIN_URL + "/auth/dang-xuat", {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) { disconnectSocket(); localStorage.removeItem("token"); dispatch(authSlice.actions.logout()); navigate("/"); }
      })
      .catch((err) => console.error("Logout failed:", err))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="relative group cursor-pointer">
      <div className="flex items-center gap-2 py-2">
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium">{user.name || user.email}</span>
        <ChevronDown size={18} className="transition-transform group-hover:rotate-180" />
      </div>
      <div className="absolute right-0 top-full mt-0 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-gray-100 transform translate-y-2 group-hover:translate-y-0">
        <div className="p-2">
          <div className="px-3 py-2 mb-2 border-b border-gray-100">
            <p className="text-xs text-gray-500">Đăng nhập với tên</p>
            <p className="text-sm font-semibold truncate">{user.name || user.email}</p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {[
              { to: "/profile/information", icon: <User size={16} className="text-gray-500" />, label: "Hồ sơ của tôi" },
              { to: "/profile/messages", icon: <MessageCircle size={16} className="text-gray-500" />, label: "Tin nhắn" },
              { to: "/profile/wallet", icon: <Landmark size={16} className="text-gray-500" />, label: "Tiền của tôi" },
              { to: "/profile/notifications", icon: <Bell size={16} className="text-gray-500" />, label: "Thông báo" },
              { to: "/profile/promotions", icon: <TicketCheck size={16} className="text-gray-500" />, label: "Các khuyến mãi" },
            ].map(({ to, icon, label }) => (
              <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
                {icon}{label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-1 mx-2"></div>
            <Link to="/selling-post" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
              <CirclePlus size={16} className="text-gray-500" />Thêm sản phẩm
            </Link>
            <Link to="/profile/product-sell" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
              <List size={16} className="text-gray-500" />Tất cả sản phẩm
            </Link>
            <Link to="/profile/sell-orders" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
              <Van size={16} className="text-gray-500" />Đơn bán
            </Link>
            <div className="h-px bg-gray-100 my-1 mx-2"></div>
            <Link to="/favorites" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
              <Heart size={16} className="text-gray-500" />Yêu thích
            </Link>
            <Link to="/profile/buy-orders" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
              <ShoppingCart size={16} className="text-gray-500" />Đơn mua
            </Link>
          </div>
          <div className="h-px bg-gray-100 my-1 mx-2"></div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 hover:cursor-pointer rounded-lg text-sm text-red-600 transition-colors group/btn">
            <LogOut size={16} className="text-red-500 group-hover/btn:text-red-600" />Đăng xuất
          </button>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default UserDropdown;
