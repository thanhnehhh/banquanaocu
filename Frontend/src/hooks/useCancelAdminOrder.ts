import { useState } from "react";
import axiosClient from "@/service/axiosClient";
import type { DonHangDTO } from "./useGetSellOrders";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useCancelAdminOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelOrder = async (
    maDonHang: number,
    lyDoHuy: string
  ): Promise<DonHangDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.put<ApiResponse<DonHangDTO>>(
        `/admin/orders/${maDonHang}/cancel`,
        { lyDoHuy }
      ) as unknown as ApiResponse<DonHangDTO>;
      return response.data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Không thể hủy đơn hàng";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cancelOrder, loading, error };
}
