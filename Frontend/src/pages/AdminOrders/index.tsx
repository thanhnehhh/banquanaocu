import { useState, useMemo, useCallback } from "react";
import { useGetAdminOrders } from "@/hooks/useGetAdminOrders";
import { useConfirmAdminOrder } from "@/hooks/useConfirmAdminOrder";
import { useCancelAdminOrder } from "@/hooks/useCancelAdminOrder";
import { type DonHangDTO } from "@/hooks/useGetSellOrders";
import { useGetOrderStatuses } from "@/hooks/useGetOrderStatuses";
import Pagination from "@/components/common/Pagination";

const STATUS_STYLE: Record<string, string> = {
  "Chờ duyệt": "bg-[#FFF4E5] text-[#C2781F]", "Đã duyệt": "bg-[#EEF2FF] text-[#3730A3]",
  "Đang giao": "bg-[#E8F2F7] text-[#2C5A78]", "Thành công": "bg-[#E8F5EB] text-[#2B6C3F]", "Đã hủy": "bg-[#FDE8E8] text-[#9D2B2B]",
};
function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status] ?? "bg-[#E2E8F0] text-slate-700"}`}>{status}</span>;
}

function OrderDetailModal({ order, onClose, onRefresh }: { order: DonHangDTO; onClose: () => void; onRefresh: () => void }) {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [lyDoHuy, setLyDoHuy] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const { confirmOrder, loading: confirming } = useConfirmAdminOrder();
  const { cancelOrder, loading: cancelling } = useCancelAdminOrder();
  const isPending = order.trangThai === "Chờ duyệt";

  const handleConfirm = async () => {
    setActionError(null);
    const result = await confirmOrder(order.maDonHang);
    if (result) { onRefresh(); onClose(); } else setActionError("Không thể xác nhận đơn hàng.");
  };
  const handleCancel = async () => {
    if (!lyDoHuy.trim()) { setActionError("Vui lòng nhập lý do hủy."); return; }
    setActionError(null);
    const result = await cancelOrder(order.maDonHang, lyDoHuy);
    if (result) { onRefresh(); onClose(); } else setActionError("Không thể hủy đơn hàng.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#F4FBEE] px-6 py-4 border-b border-[#d8edc8]">
          <div><p className="text-xs text-slate-500">Mã đơn hàng</p><p className="text-lg font-bold text-slate-800">#ORD-{order.maDonHang}</p></div>
          <div className="flex items-center gap-3"><StatusBadge status={order.trangThai} /><button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow hover:bg-slate-100">✕</button></div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#F7FCF1] p-4 text-sm">
            <div><p className="text-xs font-semibold text-slate-400 uppercase">Khách hàng</p><p className="mt-1 font-semibold text-slate-700">{order.tenKhachHang || "Khách hàng"}</p></div>
            <div><p className="text-xs font-semibold text-slate-400 uppercase">Ngày đặt</p><p className="mt-1 font-semibold text-slate-700">{order.ngayTao}</p></div>
            <div className="col-span-2"><p className="text-xs font-semibold text-slate-400 uppercase">Địa chỉ</p><p className="mt-1 font-semibold text-slate-700">{order.diaChiNhanHang}</p></div>
          </div>
          <div className="space-y-3">
            {order.chiTiet.map((item) => (
              <div key={item.maChiTietDonHang} className="flex items-center gap-4 rounded-2xl bg-[#F7FCF1] p-3">
                <img src={item.hinhAnh || "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=200&q=80"} alt={item.tenSanPham} className="h-14 w-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0"><p className="font-semibold text-slate-800 truncate">{item.tenSanPham}</p><p className="text-xs text-slate-500">{item.giaBan.toLocaleString("vi-VN")}đ × {item.soLuong}</p></div>
                <p className="font-bold text-slate-800 flex-shrink-0">{item.thanhTien.toLocaleString("vi-VN")}đ</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-[#F4FBEE] p-4 text-sm space-y-2">
            <div className="flex justify-between text-slate-600"><span>Tiền hàng</span><span>{order.tongTienSanPham.toLocaleString("vi-VN")}đ</span></div>
            <div className="flex justify-between text-slate-600"><span>Phí giao hàng</span><span>{order.chiPhiGiaoHang.toLocaleString("vi-VN")}đ</span></div>
            <div className="flex justify-between border-t border-[#d8edc8] pt-2 font-bold text-slate-800 text-base"><span>Tổng cộng</span><span className="text-[#4E6A4E]">{order.tongTien.toLocaleString("vi-VN")}đ</span></div>
          </div>
          {order.lyDoHuy && <div className="rounded-2xl bg-[#FDE8E8] p-4 text-sm"><p className="text-xs font-semibold text-[#9D2B2B] uppercase mb-1">Lý do hủy</p><p className="text-[#9D2B2B]">{order.lyDoHuy}</p></div>}
          {showCancelForm && (
            <div className="rounded-2xl border border-[#FDE8E8] bg-white p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-700">Lý do hủy đơn hàng</p>
              <textarea value={lyDoHuy} onChange={(e) => setLyDoHuy(e.target.value)} rows={3} placeholder="Nhập lý do hủy..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none resize-none" />
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setShowCancelForm(false); setLyDoHuy(""); }} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Quay lại</button>
                <button onClick={handleCancel} disabled={cancelling} className="rounded-full bg-[#9D2B2B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a2020] disabled:opacity-50">{cancelling ? "Đang hủy..." : "Xác nhận hủy"}</button>
              </div>
            </div>
          )}
          {actionError && <p className="text-sm text-red-600 text-center">{actionError}</p>}
          <div className="flex flex-wrap gap-3 pt-2">
            {isPending && !showCancelForm && (
              <>
                <button onClick={handleConfirm} disabled={confirming} className="rounded-full bg-[#4E6A4E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3E563D] disabled:opacity-50">{confirming ? "Đang xác nhận..." : "✓ Xác nhận đơn hàng"}</button>
                <button onClick={() => setShowCancelForm(true)} className="rounded-full border border-[#9D2B2B] px-5 py-3 text-sm font-semibold text-[#9D2B2B] hover:bg-[#FDE8E8]">✕ Hủy đơn hàng</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<DonHangDTO | null>(null);
  const { statuses: dbStatuses } = useGetOrderStatuses();
  const { pageData, loading, error, refetch } = useGetAdminOrders(activeTab, currentPage, 10);
  const handleRefresh = useCallback(() => refetch(), [refetch]);

  const filteredOrders = useMemo(() => {
    const list = pageData?.content || [];
    if (!searchTerm.trim()) return list;
    const lower = searchTerm.toLowerCase();
    return list.filter((o) => o.maDonHang.toString().includes(lower) || (o.tenKhachHang || "").toLowerCase().includes(lower) || o.diaChiNhanHang.toLowerCase().includes(lower));
  }, [pageData, searchTerm]);

  const tabs = useMemo(() => [{ label: "Tất cả", value: "all" }, ...(dbStatuses || []).map((s) => ({ label: s.tenTrangThai, value: s.tenTrangThai }))], [dbStatuses]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">
      <div className="flex items-center gap-3 text-sm"><span className="text-gray-500">Kênh ADMIN</span><span className="text-gray-400 font-bold">›</span><span className="font-bold text-[#1A1C19]">Quản lý đơn hàng</span></div>
      <div className="flex flex-wrap gap-2 justify-center border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button key={tab.value} onClick={() => { setActiveTab(tab.value); setCurrentPage(0); }}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition ${activeTab === tab.value ? "bg-[#49613E] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{tab.label}</button>
        ))}
      </div>
      <div className="flex justify-between items-center px-2">
        <div className="relative w-[400px]">
          <input type="text" placeholder="Tìm theo ID, Tên KH, Địa chỉ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-6 pr-12 py-3 bg-[#F3F4F1] border border-gray-200 rounded-lg focus:outline-none focus:border-[#49613E]" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F9FAF4]">
            <tr className="border-b border-gray-100">
              <th className="py-5 px-6 text-sm font-medium text-gray-500">ID đơn hàng</th>
              <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Ngày đặt</th>
              <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Khách hàng</th>
              <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Tổng cộng</th>
              <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="py-12 text-center text-gray-400">Đang tải...</td></tr>
              : error ? <tr><td colSpan={5} className="py-12 text-center text-red-500">Lỗi: {error}</td></tr>
              : filteredOrders.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-gray-400">Không tìm thấy đơn hàng.</td></tr>
              : filteredOrders.map((order) => (
                <tr key={order.maDonHang} onClick={() => setSelectedOrder(order)} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <td className="py-6 px-6 text-sm font-bold text-[#1A1C19]">#ORD-{order.maDonHang}</td>
                  <td className="py-6 px-6 text-sm text-gray-500 text-center">{order.ngayTao}</td>
                  <td className="py-6 px-6 text-sm font-bold text-[#1A1C19] text-center">{order.tenKhachHang || "Khách hàng"}</td>
                  <td className="py-6 px-6 text-sm text-[#49613E] font-bold text-center">{order.tongTien.toLocaleString("vi-VN")}đ</td>
                  <td className="py-6 px-6 text-sm text-center"><StatusBadge status={order.trangThai} /></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!loading && (pageData?.totalPages || 0) > 1 && <Pagination currentPage={currentPage} totalPages={pageData?.totalPages || 0} onPageChange={setCurrentPage} loading={loading} />}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onRefresh={handleRefresh} />}
    </div>
  );
};

export default AdminOrders;
