import axiosClient from "@/service/axiosClient";
import publicAxios from "@/service/publicAxios";

export interface BinhLuanDTO {
  maBinhLuan: number;
  noiDung: string;
  thoiGianTao: string;
  emailNguoiDung: string;
  tenNguoiDung: string;
  avatarNguoiDung?: string;
  maBinhLuanCha?: number;
  traLoi?: BinhLuanDTO[];
}

export interface TaoBinhLuanRequest {
  maSanPham: number;
  noiDung: string;
  maBinhLuanCha?: number | null;
}

/** Lấy bình luận của sản phẩm (không cần đăng nhập) */
export const getBinhLuan = (maSanPham: number) =>
  publicAxios.get<{ data: BinhLuanDTO[] }>(`/comments?maSanPham=${maSanPham}`);

/** Tạo bình luận / trả lời (cần đăng nhập) */
export const taoBinhLuan = (data: TaoBinhLuanRequest) =>
  axiosClient.post<unknown, { data: BinhLuanDTO }>("/comments", data);

/** Xóa bình luận (cần đăng nhập, chỉ chủ bình luận) */
export const xoaBinhLuan = (maBinhLuan: number) =>
  axiosClient.delete<unknown, { data: void }>(`/comments/${maBinhLuan}`);
