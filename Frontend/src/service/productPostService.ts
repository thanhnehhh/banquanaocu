import type UploadProduct from "@/model/UploadProduct";
import axiosClient from "./axiosClient";
import supabase from "@/lib/supabaseClient";

/**
 * Upload ảnh lên Supabase nếu có config.
 * Fallback: convert sang base64 và lưu trực tiếp vào DB (field duLieuAnh).
 */
export async function uploadProductImage(file: File): Promise<string> {
  // Nếu Supabase chưa config → dùng base64 fallback
  if (!supabase) {
    return await fileToBase64(file);
  }

  try {
    const bucket = import.meta.env.VITE_SUPABASE_BUCKET_PRODUCT || "product";
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });
    if (error) throw new Error("Upload ảnh thất bại: " + error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  } catch {
    // Nếu Supabase upload lỗi → fallback base64
    return await fileToBase64(file);
  }
}

/** Convert File sang base64 string */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Không thể đọc file ảnh"));
    reader.readAsDataURL(file);
  });
}

export async function postProductSeller(payload: UploadProduct): Promise<void> {
  return axiosClient.post("/products/post", payload);
}
