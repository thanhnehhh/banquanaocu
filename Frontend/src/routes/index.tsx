import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import publicRoutes from "./publicRoutes";
import ProfileLayout from "@/layouts/ProfileLayout/ProfileLayout";
import ProfileRoute from "./ProfileRoute";
import profileRoutes from "./profileRoutes";
import adminRoutes from "./adminRoutes";
import UserSellingPost from "@/pages/UserSellingPost/UserSellingPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      ...publicRoutes,
      {
        element: <ProfileRoute />,
        children: [
          {
            path: "",
            element: <ProfileLayout />,
            children: profileRoutes,
          },
          {
            path: "selling-post",
            element: <UserSellingPost />,
          },
        ],
      },
    ],
  },
  adminRoutes,
]);

export default router;
