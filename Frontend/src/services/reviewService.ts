import axiosClient from "@/service/axiosClient";

export interface TaoReviewRequest {
  maSanPham: number;
  diemXepHang: number;
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

export const taoReview = (data: TaoReviewRequest) =>
  axiosClient.post<unknown, { data: ReviewDTO }>("/reviews", data);

export const kiemTraDaDanhGia = (maSanPham: number) =>
  axiosClient.get<unknown, { data: { daDanhGia: boolean } }>(
    `/reviews/check?maSanPham=${maSanPham}`
  );

export const kiemTraCoTheDanhGia = (maSanPham: number) =>
  axiosClient.get<unknown, { data: { coTheDanhGia: boolean } }>(
    `/reviews/can-review?maSanPham=${maSanPham}`
  );
