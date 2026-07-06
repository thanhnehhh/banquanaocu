import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getDonHangCuaUser, huyDonHang } from "@/services/orderService";
import type { DonHangDTO, ChiTietDonHangDTO } from "@/services/orderService";
import { X, Store, CreditCard, Truck, Star } from "lucide-react";
import ReviewModal from "@/components/common/ReviewModal";
import { kiemTraDaDanhGia } from "@/services/reviewService";
import { chatWithSeller } from "@/services/chatService";
import { useDispatch } from "react-redux";
import chatSlice from "@/redux/chatSlice/chatSlice";

/* ── CONSTANTS ─────────────────────────────────────────────────────────── */

const tabs = [
  "Tất cả",
  "Chờ duyệt",
  "Đã duyệt",
  "Thành công",
  "Đã thanh toán",
  "Đã hủy",
] as const;
type Tab = (typeof tabs)[number];

const statusColor: Record<string, string> = {
  "Chờ duyệt":     "bg-[#FFF4E5] text-[#C2781F]",
  "Đã duyệt":      "bg-[#E8F2F7] text-[#2C5A78]",
  "Thành công":    "bg-[#E8F5EB] text-[#2B6C3F]",
  "Đã thanh toán": "bg-[#E8F5EB] text-[#2B6C3F]",
  "Đã hủy":        "bg-[#FDE8E8] text-[#9D2B2B]",
};

const LY_DO_HUY = [
  "Tôi muốn thay đổi địa chỉ giao hàng",
  "Tôi muốn thay đổi sản phẩm trong đơn",
  "Tôi đặt nhầm sản phẩm",
  "Tôi tìm được sản phẩm tốt hơn",
  "Thời gian giao hàng quá lâu",
  "Không cần mặt hàng này nữa",
  "Lý do khác",
];

/* ── COMPONENT ─────────────────────────────────────────────────────────── */

function UserBuyOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationState = location.state as { successOrderId?: number } | null;
  // Lấy giá trị ban đầu trực tiếp từ location.state, không dùng ref trong render
  const [successId, setSuccessId] = useState<number | null>(
    locationState?.successOrderId ?? null,
  );

  const [orders, setOrders] = useState<DonHangDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal hủy đơn
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Modal đánh giá
  const [reviewItem, setReviewItem] = useState<ChiTietDonHangDTO | null>(null);
  const [daDanhGiaMap, setDaDanhGiaMap] = useState<Record<number, boolean>>({});

  const ITEMS_PER_PAGE = 5;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDonHangCuaUser();
      setOrders(res.data);

      // Kiểm tra đã đánh giá — đơn "Đã duyệt" hoặc "Thành công"
      const duyetOrders = res.data.filter(
        (o) => o.trangThai === "Đã duyệt" || o.trangThai === "Thành công",
      );
      const newMap: Record<number, boolean> = {};
      await Promise.all(
        duyetOrders.flatMap((order) =>
          (order.chiTiet ?? []).map(async (ct) => {
            try {
              const r = await kiemTraDaDanhGia(ct.maSanPham);
              const checked =
                (r as unknown as { data: { daDanhGia: boolean } }).data
                  ?.daDanhGia ?? false;
              newMap[ct.maSanPham] = checked;
            } catch {
              newMap[ct.maSanPham] = false;
            }
          }),
        ),
      );
      setDaDanhGiaMap(newMap);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Effect riêng cho toast thành công — dùng setTimeout để tránh setState đồng bộ
  useEffect(() => {
    if (!successId) return;
    const t = setTimeout(() => setSuccessId(null), 5000);
    return () => clearTimeout(t);
  }, [successId]);

  /* ── Filter & Pagination ── */
  const filteredOrders = useMemo(() => {
    if (activeTab === "Tất cả") return orders;
    return orders.filter((o) => o.trangThai === activeTab);
  }, [activeTab, orders]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );
  const pageOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredOrders]);

  /* ── Handlers ── */
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const openCancelModal = (id: number) => {
    setCancelOrderId(id);
    setSelectedReason("");
    setCustomReason("");
    setCancelError(null);
  };
  const closeCancelModal = () => {
    setCancelOrderId(null);
    setSelectedReason("");
    setCustomReason("");
    setCancelError(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelOrderId) return;
    const lyDo =
      selectedReason === "Lý do khác" ? customReason.trim() : selectedReason;
    if (!lyDo) {
      setCancelError("Vui lòng chọn hoặc nhập lý do hủy.");
      return;
    }
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await huyDonHang(cancelOrderId, lyDo);
      setOrders((prev) =>
        prev.map((o) => (o.maDonHang === cancelOrderId ? res.data : o)),
      );
      closeCancelModal();
    } catch {
      setCancelError("Hủy đơn thất bại. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };
  const handeChatSeller = async (emailOpponent: any) => {
    try {
      const res = (await chatWithSeller(emailOpponent)) as any;
      console.log(res);
      if (res.success === true) {
        dispatch(chatSlice.actions.setConversationId(res.data.id));
        navigate("/profile/messages");
      }
    } catch {
      console.log("lỗi không tạo được conversation");
    }
  };

  /* ── Render ── */
  return (
    <div className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
      {/* Tiêu đề */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-1">Tài khoản › Đơn mua</p>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Đơn mua của tôi
        </h1>
      </div>

      {/* Toast thành công */}
      {successId && (
        <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
          ✅ Đặt hàng thành công! Người bán sẽ sớm xác nhận đơn của bạn.
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 rounded-2xl bg-[#F4FBEE] p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-[#4E6A4E] text-white"
                  : "bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              }`}
            >
              {tab}
              {tab !== "Tất cả" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({orders.filter((o) => o.trangThai === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách đơn */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl bg-[#F7FCF1] p-10 text-center text-slate-400">
            Đang tải đơn hàng...
          </div>
        ) : pageOrders.length === 0 ? (
          <div className="rounded-2xl bg-[#F7FCF1] p-10 text-center text-slate-500">
            Không có đơn hàng nào.
          </div>
        ) : (
          pageOrders.map((order) => (
            <div
              key={order.maDonHang}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Header đơn */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#F7FCF1] border-b border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-500">
                    Mã đơn:{" "}
                    <span className="font-bold text-slate-700">
                      #{order.maDonHang}
                    </span>
                  </span>
                  <span className="text-xs text-slate-400">
                    {order.ngayTao}
                  </span>

                  {/* Tên seller */}
                  {order.tenNguoiBan && (
                    <span className="flex items-center gap-1 text-xs text-[#4E6A4E] bg-[#E8F5E3] px-2 py-0.5 rounded-full">
                      <Store size={11} />
                      {order.tenNguoiBan}
                      {order.emailNguoiBan && (
                        <span className="text-[#4E6A4E]/70">
                          · {order.emailNguoiBan}
                        </span>
                      )}
                    </span>
                  )}

                  {/* Phương thức thanh toán */}
                  {order.phuongThucThanhToan && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <CreditCard size={11} />
                      {order.phuongThucThanhToan}
                    </span>
                  )}
                </div>

                {/* Trạng thái */}
                <div className="flex flex-row justify-center items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0 ${statusColor[order.trangThai] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {order.trangThai}
                  </span>
                  <div
                    onClick={() => handeChatSeller(order.emailNguoiBan)}
                    className="p-2 bg-gray-200 rounded-2xl hover:cursor-pointer hover:opacity-90"
                  >
                    Nhắn tin với shop
                  </div>
                </div>
              </div>

              {/* Sản phẩm */}
              <div className="px-5 py-4 space-y-3">
                {order.chiTiet?.map((ct) => (
                  <div
                    key={ct.maChiTietDonHang}
                    className="flex items-center gap-4"
                  >
                    <Link
                      to={`/product/${ct.maSanPham}`}
                      className="flex items-center gap-4 flex-1 hover:bg-slate-50 rounded-xl p-2 -mx-2 transition group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {ct.hinhAnh ? (
                          <img
                            src={ct.hinhAnh}
                            alt={ct.tenSanPham}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-[#4E6A4E] transition">
                          {ct.tenSanPham}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          x{ct.soLuong} · {ct.giaBan.toLocaleString("vi-VN")}
                          đ/cái
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-800 flex-shrink-0">
                        {ct.thanhTien.toLocaleString("vi-VN")}đ
                      </p>
                    </Link>

                    {/* Nút đánh giá — hiện khi đơn "Đã duyệt" hoặc "Thành công" */}
                    {(order.trangThai === "Đã duyệt" || order.trangThai === "Thành công") &&
                      (daDanhGiaMap[ct.maSanPham] ? (
                        <span className="flex items-center gap-1 text-xs text-[#FFA500] font-medium flex-shrink-0">
                          <Star size={13} className="fill-[#FFA500]" /> Đã đánh
                          giá
                        </span>
                      ) : (
                        <button
                          onClick={() => setReviewItem(ct)}
                          className="flex items-center gap-1 text-xs text-[#4E6A4E] font-semibold border border-[#4E6A4E] px-3 py-1.5 rounded-full hover:bg-[#4E6A4E] hover:text-white transition flex-shrink-0"
                        >
                          <Star size={13} /> Đánh giá
                        </button>
                      ))}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <Truck size={11} /> {order.diaChiNhanHang}
                  </p>
                  {order.trangThai === "Đã hủy" && order.lyDoHuy && (
                    <p className="text-xs text-red-500">
                      Lý do hủy: {order.lyDoHuy}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {order.trangThai === "Chờ duyệt" && (
                    <button
                      onClick={() => openCancelModal(order.maDonHang)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition"
                    >
                      Hủy đơn
                    </button>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Tổng cộng</p>
                    <p className="text-base font-bold text-[#4E6A4E]">
                      {order.tongTien.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Phí vận chuyển:</span>
                  <span className="font-medium text-slate-700">
                    {(order.chiPhiGiaoHang || 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-slate-200 pt-2">
                  <span className="text-slate-800">Tổng cộng:</span>
                  <span className="text-[#4E6A4E]">
                    {(order.tongTien || 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Footer - Nút hành động */}
              <div className="flex justify-end">
                {order.trangThai === "Chờ xác nhận" && (
                  <button
                    onClick={() => openCancelModal(order.maDonHang)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-9 w-9 rounded-full border text-sm font-semibold transition ${
                currentPage === i + 1
                  ? "border-[#4E6A4E] bg-[#4E6A4E] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-[#4E6A4E]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal đánh giá sản phẩm */}
      {reviewItem && (
        <ReviewModal
          maSanPham={reviewItem.maSanPham}
          tenSanPham={reviewItem.tenSanPham}
          hinhAnh={reviewItem.hinhAnh}
          onClose={() => setReviewItem(null)}
          onSuccess={() => {
            // Đánh dấu đã đánh giá ngay lập tức, không cần fetch lại
            setDaDanhGiaMap((prev) => ({
              ...prev,
              [reviewItem.maSanPham]: true,
            }));
          }}
        />
      )}

      {/* Modal hủy đơn */}
      {cancelOrderId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">
                Hủy đơn #{cancelOrderId}
              </h2>
              <button
                onClick={closeCancelModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Vui lòng chọn lý do hủy:
            </p>
            <div className="space-y-2 mb-4">
              {LY_DO_HUY.map((lyDo) => (
                <label
                  key={lyDo}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    selectedReason === lyDo
                      ? "border-[#4E6A4E] bg-[#F4FBEE]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="lyDoHuy"
                    value={lyDo}
                    checked={selectedReason === lyDo}
                    onChange={() => setSelectedReason(lyDo)}
                    className="accent-[#4E6A4E]"
                  />
                  <span className="text-sm text-slate-700">{lyDo}</span>
                </label>
              ))}
            </div>
            {selectedReason === "Lý do khác" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do của bạn..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E6A4E]/30 resize-none mb-4"
              />
            )}
            {cancelError && (
              <p className="text-sm text-red-500 mb-3">{cancelError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                className="flex-1 py-3 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold transition disabled:opacity-50"
              >
                {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserBuyOrder;
