import axiosClient from "./axiosClient";
import supabase from "@/lib/supabaseClient";

export interface UpdateProfileRequest {
  avatar?: string;
  hoDem?: string;
  ten?: string;
  birthDay?: string;
  /** 'M' = Nam, 'F' = Nữ, 'O' = Khác */
  gioiTinh?: string;
  diaChi?: string;
  soDienThoai?: string;
  hobby?: string;
}

/**
 * Upload ảnh avatar lên Supabase Storage, trả về public URL.
 */
export async function uploadAvatar(
  file: File,
  userEmail: string,
): Promise<string> {
  const bucket = import.meta.env.VITE_SUPABASE_BUCKET_PROFILE || "profile";
  const ext = file.name.split(".").pop() ?? "jpg";
  const safeEmail = userEmail.replace(/[@.]/g, "_");
  const fileName = `${safeEmail}_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) throw new Error("Upload ảnh thất bại: " + error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Gọi API backend cập nhật thông tin hồ sơ.
 * Chỉ gửi những field có trong payload (optional update).
 */
export async function updateProfileApi(
  payload: UpdateProfileRequest,
): Promise<void> {
  return axiosClient.put("/user/profile", payload);
}
