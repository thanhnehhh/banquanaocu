import UserBuyOrder from "@/pages/UserBuyOrder";
import UserChat from "@/pages/UserChat";
import UserNotification from "@/pages/UserNotification";
import UserProductSell from "@/pages/UserProductSell";
import UserProfile from "@/pages/UserProfile";
import UserPromotion from "@/pages/UserPromotion";
//import UserSellingPost from "@/pages/UserSellingPost/UserSellingPost";
import UserSellOrder from "@/pages/UserSellOrder";
import UserWallet from "@/pages/UserWallet/UserWallet";
// import UserSellingPost from "@/pages/UserSellingPost";

const profileRoutes = [
  {
    path: "profile/information",
    element: <UserProfile />,
  },
  {
    path: "profile/wallet",
    element: <UserWallet />,
  },
  {
    path: "profile/notifications",
    element: <UserNotification />,
  },
  {
    path: "profile/promotions",
    element: <UserPromotion />,
  },
  {
    path: "profile/sell-orders",
    element: <UserSellOrder />,
  },
  {
    path: "profile/buy-orders",
    element: <UserBuyOrder />,
  },
  {
    path: "profile/product-sell",
    element: <UserProductSell />,
  },
  {
    path: "/profile/messages",
    element: <UserChat />,
  },
];

export default profileRoutes;
