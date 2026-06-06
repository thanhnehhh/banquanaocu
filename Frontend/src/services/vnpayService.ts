import axiosClient from "@/service/axiosClient";

export interface VNPayCreatePaymentResponse {
  paymentUrl: string;
}

export const taoUrlThanhToanVNPay = (maDonHang: number) =>
  axiosClient.post<unknown, { data: VNPayCreatePaymentResponse }>(
    "/payment/vnpay/create-payment",
    { maDonHang }
  );
