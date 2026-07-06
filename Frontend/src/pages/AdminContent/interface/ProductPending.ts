import type ProductImagePending from "./ProductImagePending";

export default interface ProductPending {
  maSanPham: number;
  tenSanPham: string;
  soLuong: number;
  giaSanPham: string;
  emailSeller: string;
  trangThai: string;
  images: ProductImagePending[];
}
