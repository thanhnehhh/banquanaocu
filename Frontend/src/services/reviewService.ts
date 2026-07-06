import axiosClient from "@/service/axiosClient";

export interface TaoReviewRequest {
  maSanPham: number;
  diemXepHang: number; // 1-5
  nhanXet: string;
}

export interface ReviewDTO {
  maDanhGia: number;
  diemXepHang: number;
  nhanXet: string;
  emailNguoiDung: string;
  tenNguoiDung: string;
  avatarNguoiDung?: string;
}

/** Tạo đánh giá sao (cần đăng nhập, phải đã mua và đơn đã duyệt) */
export const taoReview = (data: TaoReviewRequest) =>
  axiosClient.post<unknown, { data: ReviewDTO }>("/reviews", data);

/** Kiểm tra user đã đánh giá sản phẩm này chưa */
export const kiemTraDaDanhGia = (maSanPham: number) =>
  axiosClient.get<unknown, { data: { daDanhGia: boolean } }>(
    `/reviews/check?maSanPham=${maSanPham}`
  );

/** Kiểm tra user có thể đánh giá không (đã mua + đơn Thành công/Đã duyệt) */
export const kiemTraCoTheDanhGia = (maSanPham: number) =>
  axiosClient.get<unknown, { data: { coTheDanhGia: boolean } }>(
    `/reviews/can-review?maSanPham=${maSanPham}`
  );
