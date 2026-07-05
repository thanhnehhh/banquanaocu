import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { useEffect } from "react";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchCart } from "@/redux/cartSlice/cartSlice";
import { connectSocket, disconnectSocket } from "./websocket/chatSocket";

function App() {
  const getProfile = useGetProfile();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile(token);
      dispatch(fetchCart());
      connectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
