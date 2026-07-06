import { useState, useEffect, useCallback } from "react";
import axiosClient from "@/service/axiosClient";

export interface ChiTietDonHangDTO {
  maChiTietDonHang: number;
  maSanPham: number;
  tenSanPham: string;
  soLuong: number;
  giaBan: number;
  thanhTien: number;
  hinhAnh?: string;
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
  chiTiet: ChiTietDonHangDTO[];
  tenKhachHang?: string;
  sdtKhachHang?: string;
  emailKhachHang?: string;
  tenShop?: string;
  sdtShop?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useGetSellOrders(status: string = "all") {
  const [orders, setOrders] = useState<DonHangDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchSellOrders = useCallback(async () => {
    try {
      setLoading(true);
      // axiosClient interceptor đã return response.data
      // nên 'response' ở đây chính là ApiResponse { success, message, data: [...] }
      const response = await axiosClient.get<ApiResponse<DonHangDTO[]>>(
        `/orders/sell-orders`,
        {
          params: { status },
        }
      ) as unknown as ApiResponse<DonHangDTO[]>;
      const orderData = response.data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch sell orders:", err);
      setError(err instanceof Error ? err.message : "Không thể lấy danh sách đơn bán");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [status, refreshTick]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSellOrders();
  }, [fetchSellOrders]);

  /** Gọi để reload lại danh sách đơn hàng */
  const refetch = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  return { orders, loading, error, refetch };
}
