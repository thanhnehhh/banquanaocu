import axiosClient from "../service/axiosClient";

export interface DoanhThuNgay {
  ngay: number;
  doanhThu: number;
}

export const getDoanhThuSeller = async (maSeller: number, nam: number, thang: number): Promise<DoanhThuNgay[]> => {
  const response = await axiosClient.get(`/thong-ke/seller/${maSeller}`, {
    params: { nam, thang }
  });
  return (response as any) ?? [];
};

export interface DoanhThuDanhMuc {
  tenDanhMuc: string;
  doanhThu: number;
}

export const getDoanhThuTheoDanhMuc = async (maSeller: number, thang: number, nam: number): Promise<DoanhThuDanhMuc[]> => {
  const response = await axiosClient.get(`/thong-ke/seller/${maSeller}/danh-muc`, {
    params: { thang, nam }
  });
  return response as unknown as DoanhThuDanhMuc[];
};

export const getDoanhThuTheoKhoangNgay = async (
  maSeller: number,
  tuNgay: string,
  denNgay: string,
): Promise<DoanhThuNgay[]> => {
  const response = await axiosClient.get<DoanhThuNgay[]>(
    `/thong-ke/seller/${maSeller}/khoang-ngay`,
    { params: { tuNgay, denNgay } },
  );
  return (response as any).data ?? (response as any);
};

export const getDoanhThuDanhMucTheoKhoangNgay = async (
  maSeller: number,
  tuNgay: string,
  denNgay: string,
): Promise<DoanhThuDanhMuc[]> => {
  const response = await axiosClient.get(
    `/thong-ke/seller/${maSeller}/danh-muc/khoang-ngay`,
    { params: { tuNgay, denNgay } },
  );
  return response as unknown as DoanhThuDanhMuc[];
};

export const getThongTinVi = async (maNguoiDung: number): Promise<{ soDu: number; lichSu: any[] }> => {
  return await axiosClient.get(`/vi/${maNguoiDung}`) as any;
};

export const postRutTien = async (maNguoiDung: number, soTien: number): Promise<any> => {
  return await axiosClient.post(`/vi/${maNguoiDung}/rut-tien`, null, {
    params: { soTien }
  });
};

export interface DoanhThuThang {
  thang: number;
  doanhThu: number;
}

export interface AdminThongKe {
  tongDoanhThu: number;
  tongDonHang: number;
  tongKhachHang: number;
  tongCuaHang: number;
  doanhThuTheoThang: DoanhThuThang[];
  doanhThuTheoDanhMuc: DoanhThuDanhMuc[];
}

export const getAdminThongKe = async (nam: number): Promise<AdminThongKe> => {
  const response: any = await axiosClient.get("/admin/thong-ke", {
    params: { nam }
  });
  return response.data;
};
