import { User, MessageCircle, Landmark, Bell, TicketCheck, CirclePlus, List, Van, Heart, ShoppingCart } from "lucide-react";
import HorizontalDivider from "../common/HorizontalDivider";
import MenuItem from "./MenuItem/MenuItem";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import authSlice from "@/redux/authSlice/authSlice";
import Loading from "../common/Loading";
import { disconnectSocket } from "@/websocket/chatSocket";

function SideBarUser() {
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
        if (res.ok) {
          disconnectSocket();
          localStorage.removeItem("token");
          dispatch(authSlice.actions.logout());
          navigate("/");
        }
      })
      .catch((err) => console.error("Logout failed:", err))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="pt-8 flex flex-col gap-2">
      <span className="p-2">Cài đặt</span>
      <MenuItem to="/profile/information" icon={<User size={20} />} text="Hồ sơ của tôi" />
      <MenuItem to="/profile/messages" icon={<MessageCircle size={20} />} text="Tin nhắn" />
      <MenuItem to="/profile/wallet" icon={<Landmark size={20} />} text="Tiền của tôi" />
      <MenuItem to="/profile/notifications" icon={<Bell size={20} />} text="Thông báo" />
      <MenuItem to="/profile/promotions" icon={<TicketCheck size={20} />} text="Các khuyến mãi" />
      <HorizontalDivider />
      <span className="p-2">Bán hàng</span>
      <MenuItem to="/selling-post" icon={<CirclePlus size={20} />} text="Thêm sản phẩm" />
      <MenuItem to="/profile/product-sell" icon={<List size={20} />} text="Tất cả sản phẩm" />
      <MenuItem to="/profile/sell-orders" icon={<Van size={20} />} text="Đơn bán" />
      <HorizontalDivider />
      <span className="p-2">Mua hàng</span>
      <MenuItem to="/favorites" icon={<Heart size={20} />} text="Yêu thích" />
      <MenuItem to="/profile/buy-orders" icon={<ShoppingCart size={20} />} text="Đơn mua" />
      <div className="mt-4 flex items-center justify-center">
        <button onClick={handleLogout}
          className="bg-[#4E6A4E] text-white px-5 h-10 rounded-full font-medium w-fit hover:cursor-pointer hover:opacity-80">
          Đăng xuất
        </button>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

export default SideBarUser;
