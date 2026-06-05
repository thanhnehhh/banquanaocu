import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Cart from "@/pages/Cart";
import Register from "@/pages/Register";
import Checkout from "@/pages/Checkout";
import ProductSearch from "@/pages/ProductSearch";
import ProductDetail from "@/pages/ProductDetail";
import UserSellingPost from "@/pages/UserSellingPost";
import NotFoundPage from "@/pages/NotFoundPage";
import KichHoatTaiKhoan from "@/pages/KichHoatTaiKhoan";
import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";
import VNPayReturn from "@/pages/VNPayReturn";

const publicRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  { path: "forgot-password", element: <ForgotPassword /> },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "checkout",
    element: <Checkout />,
  },
  {
    path: "search",
    element: <ProductSearch />,
  },
  {
    path: "cart",
    element: <Cart />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/kich-hoat/:maKichHoat",
    element: <KichHoatTaiKhoan />,
  },
  {
    path: "/payment/vnpay/return",
    element: <VNPayReturn />,
  },
];

export default publicRoutes;
