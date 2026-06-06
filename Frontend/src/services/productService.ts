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

// axiosClient interceptor trả về response.data (ApiResponse { success, message, data })
// Khi dùng các function này, cần lấy thêm .data từ kết quả để lấy payload thực
export const getProductDetail = (id: number | string) =>
  axiosClient.get(`/home/products/${id}`);

export const getProductsByCategory = (categoryId: number) =>
  axiosClient.get(`/home/products/category/${categoryId}`);
