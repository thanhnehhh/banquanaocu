import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type PaymentStatus = "loading" | "success" | "failed";

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [maDonHang, setMaDonHang] = useState<number | null>(null);

  useEffect(() => {
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const vnpTxnRef = searchParams.get("vnp_TxnRef"); // format: maDonHang_timestamp

    if (vnpTxnRef) {
      const id = parseInt(vnpTxnRef.split("_")[0], 10);
      if (!isNaN(id)) setMaDonHang(id);
    }

    setStatus(vnpResponseCode === "00" ? "success" : "failed");
  }, [searchParams]);

  const handleGoToOrders = () => {
    navigate("/profile/buy-orders", {
      state: status === "success" && maDonHang ? { successOrderId: maDonHang } : undefined,
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#49613E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F3] px-4">
      <div className="bg-white rounded-[20px] border border-[#E5E7E1] p-10 max-w-md w-full text-center shadow-sm">
        {status === "success" ? (
          <>
            <CheckCircle className="w-16 h-16 text-[#49613E] mx-auto mb-4" />
            <h1 className="text-[22px] font-bold text-[#1F3D2B] mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-[14px] text-[#7C8273] mb-1">
              Đơn hàng của bạn đã được thanh toán qua VNPAY.
            </p>
            {maDonHang && (
              <p className="text-[13px] text-[#9AA091] mb-6">
                Mã đơn hàng:{" "}
                <span className="font-semibold text-[#1F3D2B]">#{maDonHang}</span>
              </p>
            )}
            <button
              onClick={handleGoToOrders}
              className="w-full bg-[#1F3D2B] hover:bg-[#183022] text-white py-3 rounded-full text-[14px] font-semibold transition mb-3"
            >
              Xem đơn hàng của tôi
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-[#E5E7E1] text-[#444840] py-3 rounded-full text-[14px] font-medium hover:bg-[#F6F7F2] transition"
            >
              Tiếp tục mua sắm
            </button>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-[22px] font-bold text-red-600 mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-[14px] text-[#7C8273] mb-6">
              Giao dịch không thành công. Đơn hàng của bạn đã bị hủy.
              <br />
              Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
            <button
              onClick={handleGoToOrders}
              className="w-full bg-[#1F3D2B] hover:bg-[#183022] text-white py-3 rounded-full text-[14px] font-semibold transition mb-3"
            >
              Xem đơn hàng của tôi
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-[#E5E7E1] text-[#444840] py-3 rounded-full text-[14px] font-medium hover:bg-[#F6F7F2] transition"
            >
              Về trang chủ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VNPayReturn;
