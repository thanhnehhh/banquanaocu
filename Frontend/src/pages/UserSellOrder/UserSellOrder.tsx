import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetSellOrders, type DonHangDTO } from "@/hooks/useGetSellOrders";
import { useGetOrderStatuses, type TrangThaiDTO } from "@/hooks/useGetOrderStatuses";
import { useConfirmSellOrder } from "@/hooks/useConfirmSellOrder";
import { useCancelSellOrder } from "@/hooks/useCancelSellOrder";
import { chatWithBuyer } from "@/services/chatService";
import chatSlice from "@/redux/chatSlice/chatSlice";

// ─── Tab type ────────────────────────────────────────────────────────────────
type TabItem = TrangThaiDTO & { label: string; value: string };

// ─── Status badge map ─────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, string> = {
  "Chờ duyệt":  "bg-[#FFF4E5] text-[#C2781F]",
  "Đã duyệt":   "bg-[#EEF2FF] text-[#3730A3]",
  "Đang giao":  "bg-[#E8F2F7] text-[#2C5A78]",
  "Thành công": "bg-[#E8F5EB] text-[#2B6C3F]",
  "Đã hủy":     "bg-[#FDE8E8] text-[#9D2B2B]",
};
const DEFAULT_STATUS_STYLE = "bg-[#E2E8F0] text-slate-700";

function getStatusStyle(status: string) {
  return STATUS_STYLE[status] ?? DEFAULT_STATUS_STYLE;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
interface OrderDetailModalProps {
  order: DonHangDTO;
  onClose: () => void;
  onRefresh: () => void;
}

function OrderDetailModal({ order, onClose, onRefresh }: OrderDetailModalProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [lyDoHuy, setLyDoHuy] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { confirmOrder, loading: confirming } = useConfirmSellOrder();
  const { cancelOrder, loading: cancelling } = useCancelSellOrder();

  const isPending = order.trangThai === "Chờ duyệt";

  const handleChatWithBuyer = async () => {
    try {
      const res = (await chatWithBuyer(order.emailKhachHang)) as any;
      console.log(res);
      if (res.success === true) {
        dispatch(chatSlice.actions.setConversationId(res.data.id));
        navigate("/profile/messages");
      }
    } catch {
      console.log("Lỗi không tạo được conversation");
    }
  };

  const handleConfirm = async () => {
    setActionError(null);
    const result = await confirmOrder(order.maDonHang);
    if (result) {
      onRefresh();
      onClose();
    } else {
      setActionError("Không thể xác nhận đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleCancel = async () => {
    if (!lyDoHuy.trim()) {
      setActionError("Vui lòng nhập lý do hủy.");
      return;
    }
    setActionError(null);
    const result = await cancelOrder(order.maDonHang, lyDoHuy);
    if (result) {
      onRefresh();
      onClose();
    } else {
      setActionError("Không thể hủy đơn hàng. Vui lòng thử lại.");
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#F4FBEE] px-6 py-4 border-b border-[#d8edc8]">
          <div>
            <p className="text-xs text-slate-500">Mã đơn hàng</p>
            <p className="text-lg font-bold text-slate-800">#ORD-{order.maDonHang}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.trangThai} />
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow hover:bg-slate-100 transition"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Thông tin khách & giao hàng */}
          <div className="rounded-2xl bg-[#F7FCF1] p-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Mã đơn hàng</p>
                <p className="mt-1 font-semibold text-slate-700">#{order.maDonHang || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Khách hàng</p>
                <p className="mt-1 font-semibold text-slate-700">{order.tenKhachHang || "Không có thông tin"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Số điện thoại</p>
                <p className="mt-1 font-semibold text-slate-700">{order.sdtKhachHang || "Không có thông tin"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Ngày đặt</p>
                <p className="mt-1 font-semibold text-slate-700">{order.ngayTao || "Không có thông tin"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Trạng thái</p>
                <p className="mt-1"><StatusBadge status={order.trangThai || "Không xác định"} /></p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Địa chỉ nhận hàng</p>
                <p className="mt-1 font-semibold text-slate-700">{order.diaChiNhanHang || "Không có thông tin"}</p>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <p className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Sản phẩm ({order.chiTiet?.length || 0})
            </p>
            <div className="space-y-3">
              {order.chiTiet?.map((item) => (
                <Link
                  key={item.maChiTietDonHang}
                  to={`/product/${item.maSanPham}`}
                  className="flex items-center gap-4 rounded-2xl bg-[#F7FCF1] p-3 hover:bg-white transition-colors"
                >
                  <img
                    src={item.hinhAnh || "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=200&q=80"}
                    alt={item.tenSanPham}
                    className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate hover:text-[#4E6A4E] transition-colors">{item.tenSanPham}</p>
                    <p className="text-xs text-slate-500">
                      {(item.giaBan || 0).toLocaleString("vi-VN")}đ × {item.soLuong || 0}
                    </p>
                  </div>
                  <p className="font-bold text-slate-800 flex-shrink-0">
                    {(item.thanhTien || 0).toLocaleString("vi-VN")}đ
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="rounded-2xl bg-[#F4FBEE] p-4 text-sm space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Tiền hàng</span>
              <span>{(order.tongTienSanPham || 0).toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí giao hàng</span>
              <span>{(order.chiPhiGiaoHang || 0).toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between border-t border-[#d8edc8] pt-2 font-bold text-slate-800 text-base">
              <span>Tổng cộng</span>
              <span className="text-[#4E6A4E]">{(order.tongTien || 0).toLocaleString("vi-VN")}đ</span>
            </div>
          </div>

          {/* Lý do hủy (nếu có) */}
          {order.lyDoHuy ? (
            <div className="rounded-2xl bg-[#FDE8E8] p-4 text-sm">
              <p className="text-xs font-semibold text-[#9D2B2B] uppercase tracking-wide mb-1">Lý do hủy</p>
              <p className="text-[#9D2B2B]">{order.lyDoHuy}</p>
            </div>
          ) : order.trangThai === "Đã hủy" ? (
            <div className="rounded-2xl bg-[#FDE8E8] p-4 text-sm">
              <p className="text-xs font-semibold text-[#9D2B2B] uppercase tracking-wide mb-1">Lý do hủy</p>
              <p className="text-[#9D2B2B]">Không có thông tin</p>
            </div>
          ) : null}

          {/* Form nhập lý do hủy */}
          {showCancelForm && (
            <div className="rounded-2xl border border-[#FDE8E8] bg-white p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-700">Lý do hủy đơn hàng</p>
              <textarea
                value={lyDoHuy}
                onChange={(e) => setLyDoHuy(e.target.value)}
                placeholder="Nhập lý do hủy..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4E6A4E] resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowCancelForm(false); setLyDoHuy(""); setActionError(null); }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="rounded-full bg-[#9D2B2B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a2020] transition disabled:opacity-50"
                >
                  {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {actionError && (
            <p className="text-sm text-red-600 text-center">{actionError}</p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {/* Nhắn tin với khách */}
            <button
              onClick={handleChatWithBuyer}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              💬 Nhắn tin với khách
            </button>

            {isPending && !showCancelForm && (
              <>
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="rounded-full bg-[#4E6A4E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3E563D] transition disabled:opacity-50"
                >
                  {confirming ? "Đang xác nhận..." : "✓ Xác nhận đơn hàng"}
                </button>
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="rounded-full border border-[#9D2B2B] px-5 py-3 text-sm font-semibold text-[#9D2B2B] hover:bg-[#FDE8E8] transition"
                >
                  ✕ Hủy đơn hàng
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function UserSellOrder() {
  const [activeTabValue, setActiveTabValue] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<DonHangDTO | null>(null);
  const itemsPerPage = 5;

  const { statuses: dbStatuses } = useGetOrderStatuses();
  const { orders: apiOrders, loading, refetch } = useGetSellOrders(activeTabValue);

  // Tabs: "Tất cả" + danh sách trạng thái từ DB
  const tabs: TabItem[] = useMemo(() => {
    const allTab: TabItem = { id: 0, tenTrangThai: "Tất cả", label: "Tất cả", value: "all" };
    const statusTabs: TabItem[] = (dbStatuses || []).map((s) => ({
      ...s,
      label: s.tenTrangThai,
      value: s.tenTrangThai,
    }));
    return [allTab, ...statusTabs];
  }, [dbStatuses]);

  const pageCount = Math.max(1, Math.ceil((apiOrders || []).length / itemsPerPage));

  const pageOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return (apiOrders || []).slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, apiOrders]);

  const handleTabClick = (tab: TabItem) => {
    setActiveTabValue(tab.value);
    setCurrentPage(1);
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="py-16 px-12">
      {/* Tiêu đề */}
      <div className="flex flex-col gap-3">
        <div className="text-sm text-slate-500">Cài đặt &gt; Đơn Bán</div>
        <h1 className="text-3xl font-extrabold text-slate-900">Đơn Bán</h1>
      </div>

      {/* Tabs trạng thái */}
      <div className="mt-8 rounded-3xl bg-[#F4FBEE] p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeTabValue === tab.value
                  ? "bg-[#4E6A4E] text-white"
                  : "bg-white text-slate-700 shadow-sm hover:bg-[#eaf5e0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="mt-6 space-y-4">
        {loading && (
          <div className="rounded-3xl bg-[#F7FCF1] p-8 text-center text-slate-400">
            Đang tải...
          </div>
        )}

        {!loading && pageOrders.length === 0 && (
          <div className="rounded-3xl bg-[#F7FCF1] p-8 text-center text-slate-500">
            Không có đơn hàng phù hợp.
          </div>
        )}

        {!loading && pageOrders.map((order) => (
          <div
            key={order.maDonHang}
            onClick={() => setSelectedOrder(order)}
            className="cursor-pointer rounded-3xl bg-[#F7FCF1] p-6 shadow-sm hover:shadow-md hover:bg-[#eef7e6] transition-all"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Ảnh + thông tin */}
              <div className="flex items-start gap-4">
                <img
                  src={
                    order.chiTiet[0]?.hinhAnh ||
                    "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={order.chiTiet[0]?.tenSanPham}
                  className="h-20 w-20 rounded-2xl object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-semibold text-slate-700">{order.tenKhachHang || "Khách hàng"}</div>
                  <div className="text-xs text-slate-400">#{order.maDonHang} · {order.ngayTao}</div>
                  <div className="mt-2 font-bold text-slate-800">
                    {order.chiTiet[0]?.tenSanPham || "N/A"}
                  </div>
                  {order.chiTiet.length > 1 && (
                    <div className="text-xs text-slate-500">+{order.chiTiet.length - 1} sản phẩm khác</div>
                  )}
                </div>
              </div>

              {/* Badge + giá */}
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <StatusBadge status={order.trangThai} />
                <div className="text-lg font-bold text-slate-800">
                  {order.tongTien.toLocaleString("vi-VN")}đ
                </div>
                <span className="text-xs text-slate-400">Nhấn để xem chi tiết →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {pageCount > 1 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="rounded-full bg-[#4E6A4E] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            First Page
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentPage(index + 1)}
                className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                  currentPage === index + 1
                    ? "border-[#4E6A4E] bg-[#4E6A4E] text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage(pageCount)}
            disabled={currentPage === pageCount}
            className="rounded-full bg-[#4E6A4E] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Last Page
          </button>
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}

export default UserSellOrder;
