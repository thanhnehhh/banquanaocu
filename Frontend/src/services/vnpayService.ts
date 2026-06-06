import axiosClient from "@/service/axiosClient";

export interface VNPayCreatePaymentResponse {
  paymentUrl: string;
}

/**
 * Gọi backend tạo URL thanh toán VNPAY cho đơn hàng đã tạo.
 * @param maDonHang - mã đơn hàng cần thanh toán
 */
export const taoUrlThanhToanVNPay = (maDonHang: number) =>
  axiosClient.post<unknown, { data: VNPayCreatePaymentResponse }>(
    "/payment/vnpay/create-payment",
    { maDonHang }
  );
