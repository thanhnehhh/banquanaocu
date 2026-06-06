import { useMemo, useState } from "react";
import { useGetSellOrders } from "@/hooks/useGetSellOrders";
import { useConfirmSellOrder } from "@/hooks/useConfirmSellOrder";
import { useCancelSellOrder } from "@/hooks/useCancelSellOrder";
import type { DonHangDTO } from "@/hooks/useGetSellOrders";

const tabs = ["Tất cả", "Chờ duyệt", "Đã duyệt", "Hoàn thành", "Đã hủy"] as const;
type Tab = (typeof tabs)[number];

const tabToStatus: Record<Tab, string> = {
  "Tất cả": "all",
  "Chờ duyệt": "Chờ duyệt",
  "Đã duyệt": "Đã duyệt",
  "Hoàn thành": "Hoàn thành",
  "Đã hủy": "Đã hủy",
};

const statusColor: Record<string, string> = {
  "Chờ duyệt":  "bg-[#FFF4E5] text-[#C2781F]",
  "Đã duyệt":   "bg-[#EEF2FF] text-[#3730A3]",
  "Đang giao":  "bg-[#E8F2F7] text-[#2C5A78]",
  "Hoàn thành": "bg-[#E8F5EB] text-[#2B6C3F]",
  "Đã hủy":     "bg-[#FDE8E8] text-[#9D2B2B]",
};

function UserSellOrder() {
  const [activeTab, setActiveTab] = useState<Tab>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelModalId, setCancelModalId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const itemsPerPage = 5;

  const { orders, loading, error, refetch } = useGetSellOrders(tabToStatus[activeTab]);
  const { confirmOrder, loading: confirming } = useConfirmSellOrder();
  const { cancelOrder, loading: cancelling } = useCancelSellOrder();

  const pageCount = Math.max(1, Math.ceil(orders.length / itemsPerPage));

  const pageOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return orders.slice(start, start + itemsPerPage);
  }, [currentPage, orders]);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleConfirm = async (maDonHang: number) => {
    await confirmOrder(maDonHang);
    refetch();
  };

  const handleCancelSubmit = async () => {
    if (!cancelModalId || !cancelReason.trim()) return;
    await cancelOrder(cancelModalId, cancelReason.trim());
    setCancelModalId(null);
    setCancelReason("");
    refetch();
  };

  return (
    <div className="py-16 px-12">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-slate-500">Cài đặt &gt; Đơn Bán</div>
        <h1 className="text-3xl font-extrabold text-slate-900">Đơn Bán</h1>
      </div>

      {/* Tabs */}
      <div className="mt-8 rounded-3xl bg-[#F4FBEE] p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => handleTabClick(tab)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeTab === tab ? "bg-[#4E6A4E] text-white" : "bg-white text-slate-700 shadow-sm"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-2xl bg-[#F7FCF1] p-8 text-center text-slate-400">Đang tải đơn bán...</div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-8 text-center text-red-500">{error}</div>
        ) : pageOrders.length === 0 ? (
          <div className="rounded-2xl bg-[#F7FCF1] p-8 text-center text-slate-500">Không có đơn hàng nào.</div>
        ) : pageOrders.map((order: DonHangDTO) => (
          <div key={order.maDonHang} className="rounded-2xl bg-[#F7FCF1] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500">Mã đơn: </span>
                <span className="text-sm font-bold text-slate-700">#{order.maDonHang}</span>
                <span className="ml-4 text-xs text-slate-400">{order.ngayTao}</span>
                {order.tenKhachHang && (
                  <span className="ml-4 text-xs text-slate-500">Khách: <b>{order.tenKhachHang}</b></span>
                )}
              </div>
              <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${statusColor[order.trangThai] ?? "bg-gray-100 text-gray-600"}`}>
                {order.trangThai}
              </span>
            </div>

            {/* Sản phẩm */}
            <div className="space-y-2 mb-4">
              {order.chiTiet?.map((ct) => (
                <div key={ct.maChiTietDonHang} className="flex items-center gap-4 bg-white/60 rounded-xl p-2">
                  {ct.hinhAnh && <img src={ct.hinhAnh} alt={ct.tenSanPham} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{ct.tenSanPham}</p>
                    <p className="text-xs text-slate-500">x{ct.soLuong} · {ct.giaBan.toLocaleString("vi-VN")}đ/cái</p>
                  </div>
                  <p className="text-sm font-bold text-slate-800 flex-shrink-0">{ct.thanhTien.toLocaleString("vi-VN")}đ</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Địa chỉ: {order.diaChiNhanHang}</p>
                {order.lyDoHuy && <p className="text-xs text-red-500 mt-1">Lý do hủy: {order.lyDoHuy}</p>}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-[#4E6A4E]">{order.tongTien.toLocaleString("vi-VN")}đ</p>
                {order.trangThai === "Chờ duyệt" && (
                  <>
                    <button onClick={() => handleConfirm(order.maDonHang)} disabled={confirming}
                      className="rounded-full bg-[#4E6A4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3E563D] transition disabled:opacity-50">
                      {confirming ? "..." : "Xác nhận"}
                    </button>
                    <button onClick={() => { setCancelModalId(order.maDonHang); setCancelReason(""); }}
                      className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                      Hủy đơn
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
            className="rounded-full bg-[#4E6A4E] px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">Trang đầu</button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}
              className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${currentPage === i + 1 ? "border-[#4E6A4E] bg-[#4E6A4E] text-white" : "border-slate-300 bg-white text-slate-700"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(pageCount)} disabled={currentPage === pageCount}
            className="rounded-full bg-[#4E6A4E] px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">Trang cuối</button>
        </div>
      )}

      {/* Modal hủy đơn */}
      {cancelModalId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Hủy đơn hàng #{cancelModalId}</h2>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn..." rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E6A4E]/30 resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setCancelModalId(null)}
                className="flex-1 py-3 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50">Quay lại</button>
              <button onClick={handleCancelSubmit} disabled={cancelling || !cancelReason.trim()}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold disabled:opacity-50">
                {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSellOrder;
