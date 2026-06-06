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

export const getBinhLuan = (maSanPham: number) =>
  publicAxios.get<{ data: BinhLuanDTO[] }>(`/comments?maSanPham=${maSanPham}`);

export const taoBinhLuan = (data: TaoBinhLuanRequest) =>
  axiosClient.post<unknown, { data: BinhLuanDTO }>("/comments", data);

export const xoaBinhLuan = (maBinhLuan: number) =>
  axiosClient.delete<unknown, { data: void }>(`/comments/${maBinhLuan}`);
