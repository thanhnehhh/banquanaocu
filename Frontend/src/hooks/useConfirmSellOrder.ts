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

export function useConfirmSellOrder() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmOrder = async (maDonHang: number): Promise<DonHangDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.put<ApiResponse<DonHangDTO>>(
        `/orders/${maDonHang}/seller-confirm`
      ) as unknown as ApiResponse<DonHangDTO>;

      dispatch(addNotification({
        type: "order",
        title: "Xác nhận đơn hàng thành công",
        description: `Đơn hàng #${maDonHang} đã được xác nhận. Hãy chuẩn bị hàng và giao cho khách.`,
        link: "/profile/sell-orders",
      }));

      return response.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể xác nhận đơn hàng";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { confirmOrder, loading, error };
}
