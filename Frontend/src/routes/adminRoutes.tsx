import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import AdminUsers from "@/pages/AdminUsers";
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

const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "users", element: <AdminUsers /> },
    { path: "reports", element: <AdminReports /> },
    { path: "orders", element: <AdminOrders /> },
    { path: "products", element: <AdminProducts /> },
    { path: "content", element: <AdminContent /> },
    { path: "complaints", element: <AdminComplaints /> },
    { path: "promotions", element: <AdminPromotions /> },
    { path: "promotions/vouchers", element: <AdminVouchers /> },
    { path: "shipping", element: <AdminShipping /> },
    { path: "messages", element: <AdminMessages /> },
    { path: "reviews", element: <AdminReviews /> },
    { path: "post", element: <AdminPostProduct /> },
  ],
};

export default adminRoutes;
