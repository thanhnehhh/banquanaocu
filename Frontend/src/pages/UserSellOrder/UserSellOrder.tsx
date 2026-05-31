import { useMemo, useState } from "react";

type SellOrder = {
  id: string;
  customerName: string;
  productName: string;
  productDetails: string;
  status: "Tất cả" | "Chờ xác nhận" | "Đang giao" | "Hoàn Thành" | "Đã hủy";
  price: string;
  imageUrl: string;
  badge?: string;
};

const orders: SellOrder[] = [
  {
    id: "#ORD-9921",
    customerName: "Nguyễn Minh Tuấn",
    productName: "Sculpted Wool Blazer",
    productDetails: "Camel • Size M • Vintage Condition",
    status: "Chờ xác nhận",
    price: "$285.00",
    imageUrl:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80",
    badge: "Chờ xác nhận",
  },
  {
    id: "#ORD-9840",
    customerName: "Lê Hoàng Phát",
    productName: "Minimalist Tote Bag",
    productDetails: "Espresso • One Size • Genuine Leather",
    status: "Hoàn Thành",
    price: "$420.00",
    imageUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    badge: "Đã hoàn thành",
  },
  {
    id: "#ORD-9817",
    customerName: "Trần Thị Lan",
    productName: "Classic Denim Jacket",
    productDetails: "Indigo • Size L • New Arrival",
    status: "Đang giao",
    price: "$150.00",
    imageUrl:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#ORD-9774",
    customerName: "Phạm Quang Huy",
    productName: "Leather Crossbody Bag",
    productDetails: "Brown • One Size • Premium Leather",
    status: "Đã hủy",
    price: "$120.00",
    imageUrl:
      "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d6?auto=format&fit=crop&w=400&q=80",
  },
];

const tabs = [
  "Tất cả",
  "Chờ xác nhận",
  "Đang giao",
  "Hoàn Thành",
  "Đã hủy",
] as const;

function UserSellOrder() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const filteredOrders = useMemo(() => {
    if (activeTab === "Tất cả") return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [activeTab]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage),
  );

  const pageOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredOrders]);

  const handleTabClick = (tab: (typeof tabs)[number]) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="py-16 px-12">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-slate-500">Cài đặt &gt; Đơn Bán</div>
        <h1 className="text-3xl font-extrabold text-slate-900">Đơn Bán</h1>
      </div>

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

      <div className="mt-6 space-y-4">
        {pageOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-4xl bg-[#F7FCF1] p-6 shadow-sm"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-5">
                <img
                  src={order.imageUrl}
                  alt={order.productName}
                  className="h-28 w-28 rounded-3xl object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-700">
                    {order.customerName}
                  </div>
                  <div className="text-xs text-slate-500">ID: {order.id}</div>
                  <div className="mt-4 text-lg font-bold text-slate-900">
                    {order.productName}
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    {order.productDetails}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 items-start sm:items-end">
                <div
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    order.status === "Chờ xác nhận"
                      ? "bg-[#FFF4E5] text-[#C2781F]"
                      : order.status === "Hoàn Thành"
                        ? "bg-[#E8F5EB] text-[#2B6C3F]"
                        : order.status === "Đang giao"
                          ? "bg-[#E8F2F7] text-[#2C5A78]"
                          : order.status === "Đã hủy"
                            ? "bg-[#FDE8E8] text-[#9D2B2B]"
                            : "bg-[#E2E8F0] text-slate-700"
                  }`}
                >
                  {order.badge ?? order.status}
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {order.price}
                </div>
                <div className="flex flex-wrap gap-3">
                  {order.status === "Chờ xác nhận" ? (
                    <>
                      <button className="rounded-full bg-[#4E6A4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3E563D]">
                        Xác nhận đơn hàng
                      </button>
                      <button className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                        Chat với khách
                      </button>
                    </>
                  ) : order.status === "Hoàn Thành" ? (
                    <button className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      Xem chi tiết
                    </button>
                  ) : (
                    <button className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      Xem chi tiết
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {pageOrders.length === 0 && (
          <div className="rounded-4xl bg-[#F7FCF1] p-8 text-center text-slate-500">
            Không có đơn hàng phù hợp.
          </div>
        )}
      </div>

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
                  : "border-slate-300 bg-white text-slate-700"
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
    </div>
  );
}

export default UserSellOrder;
