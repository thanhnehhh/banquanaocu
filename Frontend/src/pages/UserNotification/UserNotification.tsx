import { useMemo, useState } from "react";

type NotificationItem = { id: number; category: "Mua" | "Bán" | "Tài khoản"; title: string; description: string; date: string; };
const notifications: NotificationItem[] = [
  { id: 1, category: "Mua", title: "Đơn hàng #OR9921 đã giao thành công", description: 'Gói hàng đã đến tay bạn. Hãy để lại đánh giá!', date: "12/03/2026" },
  { id: 2, category: "Mua", title: "Đơn hàng #OR9920 đã được xác nhận", description: "Người bán đã xác nhận đơn hàng của bạn.", date: "11/03/2026" },
  { id: 3, category: "Bán", title: "Sản phẩm mới đã được đăng thành công", description: "Sản phẩm của bạn đang chờ duyệt.", date: "10/03/2026" },
  { id: 4, category: "Tài khoản", title: "Cập nhật thông tin tài khoản thành công", description: "Mọi thay đổi đã được lưu.", date: "09/03/2026" },
  { id: 5, category: "Bán", title: "Đơn hàng #OR9919 đã thanh toán", description: "Vui lòng chuẩn bị hàng và giao ngay.", date: "08/03/2026" },
  { id: 6, category: "Mua", title: "Bạn nhận được mã giảm giá mới", description: "Mã giảm giá 10% có hiệu lực đến 30/04.", date: "07/03/2026" },
];
const tabs = ["Mua", "Bán", "Tài khoản"] as const;

function UserNotification() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Mua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const filteredItems = useMemo(() => notifications.filter((i) => i.category === activeTab), [activeTab]);
  const pageItems = useMemo(() => { const s = (currentPage - 1) * itemsPerPage; return filteredItems.slice(s, s + itemsPerPage); }, [currentPage, filteredItems]);

  return (
    <div className="py-16 px-12">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-slate-500">Trang chủ &gt; Thông báo</div>
        <h1 className="text-3xl font-extrabold text-slate-900">Thông báo</h1>
      </div>
      <div className="mt-6 rounded-3xl bg-[#F7FBF2] p-3 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeTab === tab ? "bg-[#4E6A4E] text-white" : "bg-white text-slate-700 shadow-sm"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {pageItems.map((item) => (
          <div key={item.id} className="rounded-[30px] bg-[#F7FBF2] p-6 shadow-sm transition hover:bg-[#EEF6E8]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9E8CA] text-xl text-[#4E6A4E]">🛍️</div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
              <div className="text-sm text-slate-500">{item.date}</div>
            </div>
          </div>
        ))}
        {pageItems.length === 0 && <div className="rounded-[30px] bg-[#F7FBF2] p-8 text-center text-slate-500">Không có thông báo.</div>}
      </div>
    </div>
  );
}

export default UserNotification;
