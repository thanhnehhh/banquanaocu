import type UploadProduct from "@/model/UploadProduct";
import axiosClient from "./axiosClient";
import supabase from "@/lib/supabaseClient";

export async function uploadProductImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error(
      "Supabase client chưa được khởi tạo. Kiểm tra biến môi trường VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.",
    );
  }

  const bucket = import.meta.env.VITE_SUPABASE_BUCKET_PRODUCT || "banquanaocu";
  // Sanitize tên file: bỏ ký tự đặc biệt, khoảng trắng, tiếng Việt
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) throw new Error("Upload ảnh thất bại: " + error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function postProductSeller(payload: UploadProduct): Promise<void> {
  return axiosClient.post("/products/post", payload);
}
