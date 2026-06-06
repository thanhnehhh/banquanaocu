import { useState } from "react";
import axiosClient from "@/service/axiosClient";

interface ApiResponse<T> { success: boolean; message: string; data: T; }
interface DonHangDTO { maDonHang: number; trangThai: string; [key: string]: unknown; }

export function useCancelSellOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelOrder = async (maDonHang: number, lyDoHuy: string): Promise<DonHangDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.put<ApiResponse<DonHangDTO>>(
        `/orders/${maDonHang}/seller-cancel`,
        { lyDoHuy }
      ) as unknown as ApiResponse<DonHangDTO>;
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể hủy đơn hàng");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cancelOrder, loading, error };
}
