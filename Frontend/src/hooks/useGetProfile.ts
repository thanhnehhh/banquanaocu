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
      .then((response: any) => {
        // axiosClient interceptor return response.data (ApiResponse)
        // BE trả về: { success, message, data: UserProfileResponse }
        const profile = response?.data ?? response;
        const userInfo: User = {
          email: profile.email,
          role: decodedToken.roles,
          token: decodedToken,
          avatar: profile.avatar || "",
          name: profile.ten || "",
          gioiTinh: profile.gioiTinh ? String(profile.gioiTinh) : "",
          phone: profile.soDienThoai || "",
          hobby: profile.hobby || "",
          createAt: profile.ngayDangKy || "",
          birthday: profile.birthDay || "",
          address: profile.diaChi || "",
          hoDem: profile.hoDem || "",
          googleId: profile.googleId || "",
          maNguoiDung: profile.maNguoiDung,
        };
        dispatch(authSlice.actions.login(userInfo));
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
  };
}
