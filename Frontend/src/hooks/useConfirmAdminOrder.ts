import { useState } from "react";
import axiosClient from "@/service/axiosClient";
import type { DonHangDTO } from "./useGetSellOrders";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

export function useConfirmAdminOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmOrder = async (maDonHang: number): Promise<DonHangDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.put<ApiResponse<DonHangDTO>>(
        `/admin/orders/${maDonHang}/confirm`
      ) as unknown as ApiResponse<DonHangDTO>;
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xác nhận đơn hàng");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { confirmOrder, loading, error };
}
