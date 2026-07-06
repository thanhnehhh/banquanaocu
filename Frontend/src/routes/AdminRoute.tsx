import type Token from "@/model/Token";
import { jwtDecode } from "jwt-decode";
import { Outlet, Navigate } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token as string) as Token;
  const roles = decodedToken.roles || [];
  return roles.includes("ROLE_ADMIN") ? (
    <Outlet />
  ) : (
    <Navigate to="/not-permission" replace />
  );
}

export default AdminRoute;
