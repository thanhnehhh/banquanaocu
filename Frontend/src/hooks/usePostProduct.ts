import type ImageUpload from "@/model/ImageUpload";
import type UploadProduct from "@/model/UploadProduct";
import {
  postProductSeller,
  uploadProductImage,
} from "@/service/productPostService";
import { useState } from "react";

export function usePostProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const postProduct = async (formData: UploadProduct, images: File[]) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imagesfinal: ImageUpload[] = [];

      if (images) {
        for (const image of images) {
          let img: ImageUpload = {
            tenAnh: image.name,
            duongDan: null as unknown as string,
          };
          const avatarUrl = await uploadProductImage(image);
          img.duongDan = avatarUrl;
          imagesfinal.push(img);
        }
      }
      formData.images = imagesfinal;
      console.log("Submitting product:", formData);

      await postProductSeller(formData);

      setSuccess(true);
    } catch (err: unknown) {
      const msg = "Cập nhật thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };
  return { postProduct, isLoading, error, success, setError, setSuccess };
}
