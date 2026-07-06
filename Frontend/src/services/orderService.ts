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
  phuongThucThanhToan?: string;  // "COD" | "VNPAY"
  maDonHangCha?: number;         // group các đơn con cùng 1 lần checkout
  tenNguoiBan?: string;          // tên seller của đơn này
  emailNguoiBan?: string;        // email seller
  chiTiet: ChiTietDonHangDTO[];
  sdtKhachHang?: string;
  tenShop?: string;
  sdtShop?: string;
}

export interface TaoDonHangRequest {
  diaChiNhanHang: string;
  chiPhiGiaoHang: number;
  phuongThucThanhToan?: string;
}

// Backend giờ trả về List<DonHangDTO> (nhiều đơn con theo từng seller)
export const taoDonHang = (data: TaoDonHangRequest) =>
  axiosClient.post<unknown, { data: DonHangDTO[] }>("/orders", data);

export const getDonHangCuaUser = () =>
  axiosClient.get<unknown, { data: DonHangDTO[] }>("/orders");

export const getDonHangById = (maDonHang: number) =>
  axiosClient.get<unknown, { data: DonHangDTO }>(`/orders/${maDonHang}`);

export const huyDonHang = (maDonHang: number, lyDoHuy: string) =>
  axiosClient.put<unknown, { data: DonHangDTO }>(`/orders/${maDonHang}/cancel`, {
    lyDoHuy,
  });
