import type Token from "@/model/Token";
import { jwtDecode } from "jwt-decode";
import { Outlet, Navigate } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token as string) as Token;
    const roles = decodedToken.roles || [];
    return roles.includes("ROLE_ADMIN") ? (
      <Outlet />
    ) : (
      <Navigate to="/not-permission" replace />
    );
  } catch {
    // Token không hợp lệ
    return <Navigate to="/login" replace />;
  }
}

export default AdminRoute;
