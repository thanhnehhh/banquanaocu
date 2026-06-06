import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/redux/store";
import { resetCart } from "@/redux/cartSlice/cartSlice";
import { taoDonHang } from "@/services/orderService";
import { taoUrlThanhToanVNPay } from "@/services/vnpayService";
import ShippingInfo from "./sections/ShippingInfo";
import PaymentMethod from "./sections/PaymentMethod";
import OrderSummary from "./sections/OrderSummary";

/* ================= TYPES ================= */
export type ShippingData = {
  hoTen: string;
  soDienThoai: string;
  diaChiChiTiet: string;
  thanhPho: string;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
};

export type PaymentType = "cod" | "vnpay";

const SHIPPING_FEE = 30000;

/* ================= COMPONENT ================= */
const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const cart = useSelector((state: RootState) => state.cart.cart);

  const [shipping, setShipping] = useState<ShippingData>({
    hoTen: user ? `${user.name ?? ""}`.trim() : "",
    soDienThoai: user?.phone ?? "",
    diaChiChiTiet: user?.address ?? "",
    thanhPho: "",
  });

  const [payment, setPayment] = useState<PaymentType>("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Vui lòng đăng nhập để thanh toán.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#49613E] text-white px-6 py-2 rounded-full font-medium"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Giỏ hàng trống, không thể thanh toán.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#49613E] text-white px-6 py-2 rounded-full font-medium"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  const cartItems: CartItem[] = cart.items.map((item) => ({
    id: item.maItem,
    name: item.tenSanPham,
    price: item.giaSanPham,
    qty: item.soLuong,
    image: item.hinhAnh ?? "",
  }));

  const subtotal = cart.tongTien;
  const total = subtotal + SHIPPING_FEE;

  const handleCheckout = async () => {
    const diaChi = [shipping.diaChiChiTiet, shipping.thanhPho]
      .filter(Boolean)
      .join(", ");

    if (!diaChi.trim()) { setError("Vui lòng nhập địa chỉ nhận hàng."); return; }
    if (!shipping.hoTen.trim()) { setError("Vui lòng nhập họ tên người nhận."); return; }
    if (!shipping.soDienThoai.trim()) { setError("Vui lòng nhập số điện thoại."); return; }

    setLoading(true);
    setError(null);

    try {
      // Bước 1: Tạo đơn hàng — BE trả ApiResponse { data: DonHangDTO[] }
      const res: any = await taoDonHang({
        diaChiNhanHang: `${shipping.hoTen} | ${shipping.soDienThoai} | ${diaChi}`,
        chiPhiGiaoHang: SHIPPING_FEE,
        phuongThucThanhToan: payment === "vnpay" ? "VNPAY" : "COD",
      });

      // axiosClient interceptor unwrap → res = ApiResponse, lấy res.data
      const donHangs = res?.data ?? res;
      const maDonHang = Array.isArray(donHangs) ? donHangs[0]?.maDonHang : donHangs?.maDonHang;

      if (payment === "vnpay") {
        // Thanh toán VNPAY: lấy URL rồi redirect
        const vnpRes: any = await taoUrlThanhToanVNPay(maDonHang);
        const paymentUrl = vnpRes?.data?.paymentUrl ?? vnpRes?.paymentUrl;
        dispatch(resetCart());
        window.location.href = paymentUrl;
      } else {
        // COD → về trang đơn mua
        dispatch(resetCart());
        navigate("/profile/buy-orders", {
          state: { successOrderId: maDonHang },
        });
      }
    } catch {
      setError("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <ShippingInfo data={shipping} setData={setShipping} />
        <PaymentMethod method={payment} setMethod={setPayment} />
      </div>

      {/* RIGHT */}
      <OrderSummary
        cart={cartItems}
        subtotal={subtotal}
        shippingFee={SHIPPING_FEE}
        total={total}
        loading={loading}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Checkout;
