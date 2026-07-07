import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import AdminUsers from "@/pages/AdminUsers";
import AdminCategories from "@/pages/AdminCategories";
import AdminReports from "@/pages/AdminReports";
import AdminOrders from "@/pages/AdminOrders";
import AdminProducts from "@/pages/AdminProducts";
import AdminContent from "@/pages/AdminContent";
import AdminComplaints from "@/pages/AdminComplaints";
import AdminPromotions from "@/pages/AdminPromotions";
import AdminVouchers from "@/pages/AdminVouchers";
import AdminShipping from "@/pages/AdminShipping";
import AdminMessages from "@/pages/AdminMessages";
import AdminReviews from "@/pages/AdminReviews";
import AdminPostProduct from "@/pages/AdminPostProduct";
import AdminRoute from "./adminRoute";

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4">
    <h2 className="text-2xl font-bold text-[#49613E]">{title}</h2>
    <p className="text-gray-500">Tính năng đang được phát triển</p>
  </div>
);

const adminRoutes = {
  path: "/admin",
  element: <AdminRoute />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { path: "users", element: <AdminUsers /> },
        { path: "categories", element: <AdminCategories /> },
        { path: "reports", element: <AdminReports /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "products", element: <AdminProducts /> },
        { path: "content", element: <AdminContent /> },
        { path: "complaints", element: <AdminComplaints /> },
        { path: "promotions", element: <AdminPromotions /> },
        { path: "promotions/vouchers", element: <AdminVouchers /> },
        { path: "promotions/campaigns", element: <ComingSoon title="Chương trình khuyến mãi" /> },
        { path: "promotions/history", element: <ComingSoon title="Lịch sử sử dụng" /> },
        { path: "promotions/reports", element: <ComingSoon title="Báo cáo hiệu quả" /> },
        { path: "shipping", element: <AdminShipping /> },
        { path: "messages", element: <AdminMessages /> },
        { path: "reviews", element: <AdminReviews /> },
        { path: "post", element: <AdminPostProduct /> },
      ],
    },
  ],
};

export default adminRoutes;
