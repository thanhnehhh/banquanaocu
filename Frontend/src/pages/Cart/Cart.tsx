import React, { useEffect, useState } from "react";
import { Leaf, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  fetchCart,
  removeItemFromCart,
  updateItemQty,
} from "@/redux/cartSlice/cartSlice";

const SHIPPING_FEE = 30000;

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const { cart, loading, error } = useSelector(
    (state: RootState) => state.cart,
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const handleRemove = async (maItem: number) => {
    try {
      await dispatch(removeItemFromCart(maItem)).unwrap();
      showToast("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch {
      showToast("error", "Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleUpdateQty = (maItem: number, soLuong: number) => {
    if (soLuong < 1) return;
    dispatch(updateItemQty({ maItem, soLuong }));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">
          Vui lòng đăng nhập để xem giỏ hàng.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#49613E] text-white px-6 py-2 rounded-full font-medium"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (acc, item) => acc + item.giaSanPham * item.soLuong,
    0,
  );
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#1A1C19]">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${toast.type === "success" ? "bg-[#49613E]" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
      {/* Breadcrumb */}
      <div className="px-8 py-4 text-sm text-gray-500">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Trang chủ
        </span>
        <span className="mx-2">›</span>
        <span className="font-medium text-[#1A1C19]">Giỏ hàng của tôi</span>
      </div>

      <main className="max-w-7xl mx-auto px-8 pb-20 mt-4">
        <h2 className="text-[28px] font-bold mb-8 uppercase tracking-wide">
          GIỎ HÀNG CỦA TÔI
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="bg-white p-8 text-center rounded-md border border-[#E5E5E5]">
                <p className="text-gray-400">Đang tải giỏ hàng...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-md border border-[#E5E5E5]">
                <p className="text-gray-500 mb-4">
                  Giỏ hàng của bạn đang trống.
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="bg-[#49613E] text-white px-6 py-2 rounded-full font-medium"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.maItem} className="flex bg-[#f5f5f5] p-6 rounded-md">
                  <div className="w-28 h-28 bg-white mr-6 flex-shrink-0 rounded-lg overflow-hidden">
                    <a href={`/product/${item.maSanPham}`}>
                      {item.hinhAnh ? (
                        <img src={item.hinhAnh} alt={item.tenSanPham}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No image</div>
                      )}
                    </a>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <a href={`/product/${item.maSanPham}`}
                          className="text-[18px] font-medium text-[#1A1C19] hover:text-[#49613E] hover:underline transition-colors">
                          {item.tenSanPham}
                        </a>
                        <span className="font-bold text-[18px]">
                          {(item.giaSanPham * item.soLuong).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Người bán: {item.tenNguoiBan}
                      </p>
                      <p className="text-sm text-gray-500">
                        Đơn giá: {item.giaSanPham.toLocaleString("vi-VN")}đ
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Quantity control */}
                      <div className="flex items-center border border-gray-200 rounded bg-white">
                        <button
                          onClick={() =>
                            handleUpdateQty(item.maItem, item.soLuong - 1)
                          }
                          disabled={item.soLuong <= 1 || loading}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 text-sm font-medium border-l border-r border-gray-200">
                          {item.soLuong}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQty(item.maItem, item.soLuong + 1)
                          }
                          disabled={
                            item.soLuong >= item.soLuongTonKho || loading
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.maItem)}
                        disabled={loading}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E74C3C] transition-colors font-medium disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                        XÓA KHỎI GIỎ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#e8ecea] p-8 rounded-md">
              <h3 className="text-xl font-semibold mb-6 tracking-wide text-gray-800 uppercase">
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-4 text-[15px] text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính ({items.length} món)</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {items.length > 0
                      ? SHIPPING_FEE.toLocaleString("vi-VN") + "đ"
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-300 pt-6 mb-8">
                <span className="text-sm font-medium text-gray-600 tracking-wider uppercase">
                  Tổng cộng
                </span>
                <span className="text-3xl font-light text-[#1A1C19]">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || loading}
                className="w-full bg-[#4d5e45] text-white py-4 font-medium tracking-wide rounded hover:bg-[#3A4930] mb-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                TIẾN HÀNH THANH TOÁN
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full text-center text-sm font-medium text-gray-600 tracking-wider hover:text-black hover:underline transition-colors"
              >
                TIẾP TỤC SĂN ĐỒ SI
              </button>

              <div className="mt-6 bg-white/60 p-4 flex gap-3 items-start rounded-md text-[13px] text-gray-600 leading-relaxed font-medium">
                <Leaf className="w-5 h-5 flex-shrink-0 text-[#4d5e45]" />
                <p>
                  CHỌN ĐỒ SI LÀ BẠN ĐANG GÓP PHẦN BẢO VỆ MÔI TRƯỜNG. CẢM ƠN
                  BẠN!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
