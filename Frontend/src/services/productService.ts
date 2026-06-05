import axiosClient from "@/service/axiosClient";

export interface ReviewDTO {
  maDanhGia: number;
  diemXepHang: number;
  nhanXet: string;
  emailNguoiDung: string;
  tenNguoiDung: string;
  avatarNguoiDung: string;
}

export interface ProductDetailDTO {
  maSanPham: number;
  tenSanPham: string;
  soLuong: number;
  giaSanPham: number;
  tenTheLoai: string;
  maTheLoai: number;
  email: string;
  maNguoiBan: number;
  tenNguoiBan: string;
  hinhAnhDaiDien: string;
  danhGia: number;
  soLuongDanhGia: number;
  hinhAnhs: string[];
  danhGias: ReviewDTO[];
}

export const getProductDetail = (id: number | string) =>
  axiosClient.get<ProductDetailDTO>(`/home/products/${id}`);

export const getProductsByCategory = (categoryId: number) =>
  axiosClient.get<{ data: ProductDetailDTO[] }>(`/home/products/category/${categoryId}`);
