import { useState, useCallback } from "react";
import axiosClient from "@/service/axiosClient";
import type { DonHangDTO } from "./useGetSellOrders";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (maDonHang: number, trangThaiMoi: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.put<ApiResponse<DonHangDTO>>(
        `/admin/orders/${maDonHang}/status`,
        { trangThai: trangThaiMoi }
      ) as unknown as ApiResponse<DonHangDTO>;
      if (response.success) return true;
      setError(response.message || "Cập nhật trạng thái thất bại");
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật trạng thái đơn hàng");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStatus, loading, error };
}
