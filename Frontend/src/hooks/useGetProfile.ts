import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axiosClient from "@/service/axiosClient";
import authSlice from "@/redux/authSlice/authSlice";
import type Token from "@/model/Token";
import type User from "@/model/User";

export function useGetProfile() {
  const dispatch = useDispatch();

  return function getProfile(token: string): void {
    const decodedToken = jwtDecode(token) as Token;
    axiosClient
      .get(`/user/profile`)
      .then((response) => {
        const data = response.data;

        console.log("=== DATA PROFILE THỰC TẾ TỪ BACKEND ===", data);
        const userInfo: User = {
          maNguoiDung: data.maNguoiDung || data.id,
          email: data.email,
          role: decodedToken.roles,
          token: decodedToken,
          avatar: data.avatar || "",
          name: data.ten || "",
          gioiTinh: data.gioiTinh || "",
          phone: data.soDienThoai || "",
          hobby: data.hobby || "",
          createAt: data.ngayDangKy || "",
          birthday: data.birthDay || "",
          address: data.diaChi || "",
          hoDem: data.hoDem || "",
          googleId: data.googleId || "",
        };

        dispatch(authSlice.actions.login(userInfo));
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
  };
}
