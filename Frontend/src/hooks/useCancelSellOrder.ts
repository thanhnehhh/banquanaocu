import { useState } from "react";
import axiosClient from "@/service/axiosClient";
import { useDispatch } from "react-redux";
import { addNotification } from "@/redux/notificationSlice/notificationSlice";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface DonHangDTO {
  maDonHang: number;
  trangThai: string;
  [key: string]: unknown;
}

export function useCancelSellOrder() {
  const dispatch = useDispatch();
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
        `/orders/${maDonHang}/seller-cancel`,
        { lyDoHuy }
      ) as unknown as ApiResponse<DonHangDTO>;

      dispatch(addNotification({
        type: "order",
        title: "Đã hủy đơn hàng",
        description: `Đơn hàng #${maDonHang} đã được hủy. Lý do: ${lyDoHuy}`,
        link: "/profile/sell-orders",
      }));

      return response.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể hủy đơn hàng";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cancelOrder, loading, error };
}
