import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateProfileApi,
  uploadAvatar,
  type UpdateProfileRequest,
} from "@/service/userProfileService";
import authSlice from "@/redux/authSlice/authSlice";

export function useUpdateProfile() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (
    payload: UpdateProfileRequest,
    avatarFile: File | null,
    userEmail: string,
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const finalPayload = { ...payload };

      // Upload ảnh lên Supabase trước nếu user chọn ảnh mới
      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile, userEmail);
        finalPayload.avatar = avatarUrl;
      }

      // Gọi API backend
      console.log("Updating profile with payload:", finalPayload);
      await updateProfileApi(finalPayload);

      // Cập nhật Redux state với dữ liệu mới
      // Map ngược từ request fields về User model fields
      const userUpdate: Record<string, string | undefined> = {};
      if (finalPayload.avatar !== undefined)
        userUpdate.avatar = finalPayload.avatar;
      if (finalPayload.hoDem !== undefined)
        userUpdate.hoDem = finalPayload.hoDem;
      if (finalPayload.ten !== undefined) userUpdate.name = finalPayload.ten;
      if (finalPayload.birthDay !== undefined)
        userUpdate.birthday = finalPayload.birthDay;
      if (finalPayload.gioiTinh !== undefined)
        userUpdate.gioiTinh = finalPayload.gioiTinh;
      if (finalPayload.diaChi !== undefined)
        userUpdate.address = finalPayload.diaChi;
      if (finalPayload.soDienThoai !== undefined)
        userUpdate.phone = finalPayload.soDienThoai;
      if (finalPayload.hobby !== undefined)
        userUpdate.hobby = finalPayload.hobby;

      dispatch(authSlice.actions.updateProfile(userUpdate));
      setSuccess(true);
    } catch (err: unknown) {
      const msg = "Cập nhật thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error, success };
}
