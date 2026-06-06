import type { CartItem } from "../Checkout";

type Props = {
  cart: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  loading: boolean;
  onCheckout: () => void;
};

const OrderSummary = ({ cart, subtotal, shippingFee, total, loading, onCheckout }: Props) => {
  return (
    <div className="bg-[#F7F7F3] p-6 rounded-[20px] border border-[#E5E7E1]">
      <h2 className="text-[20px] font-semibold text-[#1F3D2B] mb-6">
        Tóm tắt đơn hàng
      </h2>

      {/* Danh sách sản phẩm */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-[60px] h-[60px] rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#1A1C19] truncate">
                {item.name}
              </p>
              <p className="text-[12px] text-[#7C8273] mt-0.5">
                x{item.qty}
              </p>
              <p className="text-[13px] text-[#1F3D2B] font-semibold mt-0.5">
                {(item.price * item.qty).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E5E7E1] my-5" />

      {/* Tổng tiền */}
      <div className="space-y-3 text-[14px] text-[#444840]">
        <div className="flex justify-between">
          <span>Tạm tính ({cart.length} sản phẩm)</span>
          <span>{subtotal.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#E5E7E1]">
        <span className="text-[16px] font-semibold text-[#1F3D2B]">Tổng cộng</span>
        <span className="text-[22px] font-bold text-[#1F3D2B]">
          {total.toLocaleString("vi-VN")}đ
        </span>
      </div>

      {/* Nút đặt hàng */}
      <button
        onClick={onCheckout}
        disabled={loading || cart.length === 0}
        className="w-full mt-6 bg-[#1F3D2B] hover:bg-[#183022] text-white py-3.5 rounded-full text-[14px] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          "Xác nhận đặt hàng →"
        )}
      </button>

      <p className="text-[10px] text-center text-[#7C8273] mt-4 leading-[16px]">
        Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của OReMA.
      </p>
    </div>
  );
};

export default OrderSummary;
