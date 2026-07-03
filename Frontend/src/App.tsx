import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { useEffect } from "react";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchCart } from "@/redux/cartSlice/cartSlice";
// WebSocket chat chỉ hoạt động khi BE có ConversationController
// import { connectSocket, disconnectSocket } from "./websocket/chatSocket";

function App() {
  const getProfile = useGetProfile();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile(token);
      dispatch(fetchCart());
    }
    // Tạm tắt WebSocket vì banquanaocu BE chưa có chat endpoint
    // connectSocket();
    // return () => { disconnectSocket(); };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
