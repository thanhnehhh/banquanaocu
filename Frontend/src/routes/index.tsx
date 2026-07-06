import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import publicRoutes from "./publicRoutes";
import ProfileLayout from "@/layouts/ProfileLayout/ProfileLayout";
import ProfileRoute from "./ProfileRoute";
import profileRoutes from "./profileRoutes";
import adminRoutes from "./adminRoutes";
import UserSellingPost from "@/pages/UserSellingPost/UserSellingPost";

const router = createBrowserRouter([
  // --- KHU VỰC 1: DÀNH CHO KHÁCH HÀNG ---
  {
    path: "/",
    element: <UserLayout />, // Load Header và Footer chung của OReMA
    // errorElement: (
    //   <div className="text-3xl flex m-auto ">
    //     Đã có lỗi xảy ra. Vui lòng thử lại sau.
    //   </div>
    // ),
    children: [
      ...publicRoutes, // Các trang public (Home, Login, Search, Detail...)
      {
        element: <ProfileRoute />, // Chặn nếu chưa đăng nhập
        children: [
          {
            path: "",
            element: <ProfileLayout />,
            children: profileRoutes, // Các trang cá nhân (Đơn hàng, Ví...)
          },
          {
            path: "selling-post",
            element: <UserSellingPost />,
          },
        ],
      },
    ],
  },

  // --- KHU VỰC 2: DÀNH CHO ADMIN ---
  // Đặt độc lập hoàn toàn để không bị dính UserLayout
  adminRoutes,
]);

export default router;
