import axiosClient from "../service/axiosClient";

export interface DoanhThuNgay {
  ngay: number;
  doanhThu: number;
}

export const getDoanhThuSeller = async (maSeller: number, nam: number, thang: number): Promise<DoanhThuNgay[]> => {
  // axiosClient baseURL đã là http://localhost:8080/api → chỉ cần /thong-ke/...
  const response = await axiosClient.get(`/thong-ke/seller/${maSeller}`, {
    params: { nam, thang }
  });
  // axiosClient interceptor return ApiResponse → thongke trả List trực tiếp (không wrap ApiResponse)
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

export const getThongTinVi = async (maNguoiDung: number): Promise<{ soDu: number; lichSu: any[] }> => {
  return await axiosClient.get(`/vi/${maNguoiDung}`) as any;
};

export const postRutTien = async (maNguoiDung: number, soTien: number): Promise<any> => {
  return await axiosClient.post(`/vi/${maNguoiDung}/rut-tien`, null, {
    params: { soTien }
  });
};
