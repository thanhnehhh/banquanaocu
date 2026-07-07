import type ImageUpload from "@/model/ImageUpload";
import type UploadProduct from "@/model/UploadProduct";
import {
  postProductSeller,
  uploadProductImage,
} from "@/service/productPostService";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "@/redux/notificationSlice/notificationSlice";

export function usePostProduct() {
  const dispatch = useDispatch();
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

      await postProductSeller(formData);

      setSuccess(true);

      // Push thông báo
      dispatch(addNotification({
        type: "product",
        title: "Đăng bán sản phẩm thành công",
        description: `Sản phẩm "${formData.tenSanPham}" đang chờ admin duyệt. Bạn có thể theo dõi tại mục Tất cả sản phẩm.`,
        link: "/profile/product-sell",
      }));
    } catch (err: unknown) {
      const msg = "Cập nhật thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };
  return { postProduct, isLoading, error, success, setError, setSuccess };
}
