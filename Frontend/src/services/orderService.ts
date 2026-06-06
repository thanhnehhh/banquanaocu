import axiosClient from "@/service/axiosClient";

export interface ChiTietDonHangDTO {
  maChiTietDonHang: number;
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string;
  soLuong: number;
  giaBan: number;
  thanhTien: number;
}

export interface DonHangDTO {
  maDonHang: number;
  ngayTao: string;
  diaChiNhanHang: string;
  chiPhiGiaoHang: number;
  tongTienSanPham: number;
  tongTien: number;
  trangThai: string;
  lyDoHuy?: string;
  phuongThucThanhToan?: string;   // "COD" | "VNPAY"
  maDonHangCha?: number;          // group đơn con cùng 1 lần checkout
  tenKhachHang?: string;          // tên người mua
  tenNguoiBan?: string;           // tên seller
  emailNguoiBan?: string;         // email seller
  chiTiet: ChiTietDonHangDTO[];
}

export interface TaoDonHangRequest {
  diaChiNhanHang: string;
  chiPhiGiaoHang: number;
  phuongThucThanhToan?: string;
}

export const taoDonHang = (data: TaoDonHangRequest) =>
  axiosClient.post<unknown, { data: DonHangDTO[] }>("/orders", data);

export const getDonHangCuaUser = () =>
  axiosClient.get<unknown, { data: DonHangDTO[] }>("/orders");

export const getDonHangById = (maDonHang: number) =>
  axiosClient.get<unknown, { data: DonHangDTO }>(`/orders/${maDonHang}`);

export const huyDonHang = (maDonHang: number, lyDoHuy: string) =>
  axiosClient.put<unknown, { data: DonHangDTO }>(`/orders/${maDonHang}/cancel`, { lyDoHuy });
