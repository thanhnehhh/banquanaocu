import { Outlet, Navigate } from "react-router-dom";

function ProfileRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProfileRoute;
