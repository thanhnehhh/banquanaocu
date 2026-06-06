import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getDonHangCuaUser, huyDonHang } from "@/services/orderService";
import type { DonHangDTO } from "@/services/orderService";
import { X } from "lucide-react";

const tabs = [
  "Tất cả",
  "Chờ duyệt",
  "Đã duyệt",
  "Đã thanh toán",
  "Hoàn thành",
  "Đã hủy",
] as const;

type Tab = (typeof tabs)[number];

const statusColor: Record<string, string> = {
  "Chờ duyệt":      "bg-[#FFF4E5] text-[#C2781F]",
  "Đã duyệt":       "bg-[#EEF2FF] text-[#3730A3]",
  "Đã thanh toán":  "bg-[#E8F2F7] text-[#2C5A78]",
  "Hoàn thành":     "bg-[#E8F5EB] text-[#2B6C3F]",
  "Đã hủy":         "bg-[#FDE8E8] text-[#9D2B2B]",
};

const LY_DO_HUY_PHO_BIEN = [
  "Tôi muốn thay đổi địa chỉ giao hàng",
  "Tôi muốn thay đổi sản phẩm trong đơn",
  "Tôi đặt nhầm sản phẩm",
  "Tôi tìm được sản phẩm tốt hơn",
  "Thời gian giao hàng quá lâu",
  "Không cần mặt hàng này nữa",
  "Lý do khác",
];

function UserBuyOrder() {
  const location = useLocation();
  const [orders, setOrders] = useState<DonHangDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const locationState = location.state as { successOrderId?: number } | null;
  const [successId, setSuccessId] = useState<number | null>(
    locationState?.successOrderId ?? null,
  );

  // Modal hủy đơn
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const itemsPerPage = 5;

  // Lấy successOrderId từ location.state trước khi render (không dùng setState trong effect)
  const initialSuccessId = useRef(locationState?.successOrderId ?? null);

  const fetchOrders = () => {
    setLoading(true);
    getDonHangCuaUser()
      .then((res: any) => {
        // axiosClient interceptor return response.data (ApiResponse)
        // BE trả về: { success, message, data: DonHangDTO[] }
        const list = res?.data ?? res;
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialSuccessId.current) {
      const timer = setTimeout(() => setSuccessId(null), 4000);
      fetchOrders();
      return () => clearTimeout(timer);
    }
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "Tất cả") return orders;
    return orders.filter((o) => o.trangThai === activeTab);
  }, [activeTab, orders]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));

  const pageOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [currentPage, filteredOrders]);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const openCancelModal = (maDonHang: number) => {
    setCancelOrderId(maDonHang);
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

    const lyDo = selectedReason === "Lý do khác" ? customReason.trim() : selectedReason;
    if (!lyDo) {
      setCancelError("Vui lòng chọn hoặc nhập lý do hủy.");
      return;
    }

    setCancelling(true);
    setCancelError(null);
    try {
      const res: any = await huyDonHang(cancelOrderId, lyDo);
      // axiosClient interceptor return ApiResponse, lấy .data
      const updated = res?.data ?? res;
      setOrders((prev) =>
        prev.map((o) => (o.maDonHang === cancelOrderId ? updated : o)),
      );
      closeCancelModal();
    } catch {
      setCancelError("Hủy đơn thất bại. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="py-16 px-12">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-slate-500">Tài khoản &gt; Đơn mua</div>
        <h1 className="text-3xl font-extrabold text-slate-900">Đơn mua của tôi</h1>
      </div>

      {successId && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          ✅ Đặt hàng thành công! Mã đơn hàng: #{successId}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 rounded-3xl bg-[#F4FBEE] p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-[#4E6A4E] text-white"
                  : "bg-white text-slate-700 shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-2xl bg-[#F7FCF1] p-8 text-center text-slate-400">
            Đang tải đơn hàng...
          </div>
        ) : pageOrders.length === 0 ? (
          <div className="rounded-2xl bg-[#F7FCF1] p-8 text-center text-slate-500">
            Không có đơn hàng nào.
          </div>
        ) : (
          pageOrders.map((order) => (
            <div key={order.maDonHang} className="rounded-2xl bg-[#F7FCF1] p-6 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-500">Mã đơn: </span>
                  <span className="text-sm font-bold text-slate-700">#{order.maDonHang}</span>
                  <span className="ml-4 text-xs text-slate-400">{order.ngayTao}</span>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${statusColor[order.trangThai] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.trangThai}
                </span>
              </div>

              {/* Sản phẩm */}
              <div className="space-y-3">
                {order.chiTiet?.map((ct) => (
                  <Link
                    key={ct.maChiTietDonHang}
                    to={`/product/${ct.maSanPham}`}
                    className="flex items-center gap-4 hover:bg-white/60 rounded-xl p-2 -mx-2 transition"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {ct.hinhAnh ? (
                        <img src={ct.hinhAnh} alt={ct.tenSanPham} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate hover:text-[#4E6A4E] transition">
                        {ct.tenSanPham}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        x{ct.soLuong} · {ct.giaBan.toLocaleString("vi-VN")}đ/cái
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-800 flex-shrink-0">
                      {ct.thanhTien.toLocaleString("vi-VN")}đ
                    </p>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 truncate">
                    Địa chỉ: {order.diaChiNhanHang}
                  </p>
                  {order.tenNguoiBan && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Người bán: <span className="font-medium">{order.tenNguoiBan}</span>
                    </p>
                  )}
                  {order.trangThai === "Đã hủy" && order.lyDoHuy && (
                    <p className="text-xs text-red-500 mt-1">
                      Lý do hủy: {order.lyDoHuy}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Nút hủy đơn — chỉ hiện khi "Chờ duyệt" */}
                  {order.trangThai === "Chờ duyệt" && (
                    <button
                      onClick={() => openCancelModal(order.maDonHang)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition"
                    >
                      Hủy đơn
                    </button>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Tổng cộng</p>
                    <p className="text-lg font-bold text-[#4E6A4E]">
                      {order.tongTien.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
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
              className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                currentPage === i + 1
                  ? "border-[#4E6A4E] bg-[#4E6A4E] text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal hủy đơn */}
      {cancelOrderId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            {/* Header modal */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Hủy đơn hàng #{cancelOrderId}</h2>
              <button onClick={closeCancelModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Vui lòng chọn lý do hủy đơn hàng:
            </p>

            {/* Danh sách lý do */}
            <div className="space-y-2 mb-4">
              {LY_DO_HUY_PHO_BIEN.map((lyDo) => (
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

            {/* Input lý do khác */}
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

            {/* Buttons */}
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
