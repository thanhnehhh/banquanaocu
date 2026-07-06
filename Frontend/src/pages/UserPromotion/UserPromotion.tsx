const offers = [
  {
    id: 1,
    category: "Vận chuyển",
    title: "Miễn phí vận chuyển",
    description: "Áp dụng cho mọi đơn hàng toàn quốc",
    cost: "300 điểm",
    action: "Đổi ngay",
  },
  {
    id: 2,
    category: "Vận chuyển",
    title: "Miễn phí vận chuyển",
    description: "Áp dụng cho mọi đơn hàng toàn quốc",
    cost: "300 điểm",
    action: "Đổi ngay",
  },
  {
    id: 3,
    category: "Giảm giá",
    title: "Giảm giá 10%",
    description: "Giảm tối đa 50k cho đơn từ 200k",
    cost: "500 điểm",
    action: "Đổi ngay",
  },
  {
    id: 4,
    category: "Cashback",
    title: "Hoàn tiền 50k",
    description: "Hoàn vào ví Tiền của tôi",
    cost: "2,000 điểm",
    action: "Đổi ngay",
  },
];

const myBenefits = [
  {
    id: 1,
    type: "Giảm giá",
    title: "-15% Toàn đơn hàng",
    subtitle: "Hết hạn: 15/10/2023",
  },
  {
    id: 2,
    type: "Vận chuyển",
    title: "Freeship Extra",
    subtitle: "Sử dụng ngay",
  },
];

function UserPromotion() {
  return (
    <div className="py-16 px-12">
      <div className="flex flex-col gap-6">
        <div className="rounded-[40px] bg-[#F4FBEE] p-8 shadow-sm sm:flex sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Tổng điểm tích lũy
            </div>
            <div className="mt-4 text-5xl font-extrabold text-slate-900">
              2,450{" "}
              <span className="text-2xl font-medium text-slate-500">điểm</span>
            </div>
            <div className="mt-4 inline-flex items-center rounded-full bg-[#EEF4D7] px-4 py-2 text-sm font-semibold text-[#4E6A4E]">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-[#4E6A4E]" />
              Raking: Gold
            </div>
          </div>

          <div className="mt-6 sm:mt-0 sm:ml-8 flex justify-end">
            <div className="overflow-hidden rounded-4xl bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                alt="Promotion"
                className="h-56 w-96 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Đổi ưu đãi
                </h2>
              </div>
              <button className="text-sm font-semibold text-[#4E6A4E] hover:underline">
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E9F2D9] text-[#4E6A4E] text-xl">
                      🚚
                    </div>
                    <span className="rounded-full bg-[#F4F7EC] px-3 py-1 text-[11px] font-semibold uppercase text-slate-600">
                      {offer.category}
                    </span>
                  </div>
                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {offer.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {offer.cost}
                    </div>
                    <button className="rounded-full border border-[#4E6A4E] px-5 py-2 text-sm font-semibold text-[#4E6A4E] transition hover:bg-[#F4F7EC]">
                      {offer.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <div className="rounded-4xl bg-[#F4FBEE] p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Ưu đãi của tôi
                </h2>
                <span className="text-sm font-semibold text-[#4E6A4E]">
                  3 ưu đãi
                </span>
              </div>

              <div className="space-y-4">
                {myBenefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="rounded-3xl bg-white p-4 shadow-sm"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {benefit.type}
                    </div>
                    <div className="mt-3 text-base font-semibold text-slate-900">
                      {benefit.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {benefit.subtitle}
                    </div>
                  </div>
                ))}

                <div className="rounded-3xl bg-[#4E6A4E] p-5 text-white shadow-sm">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D7E6C8]">
                    Chương trình đặc biệt
                  </div>
                  <div className="mt-4 text-lg font-bold">
                    Mời bạn bè - Nhận 500 điểm
                  </div>
                  <button className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#4E6A4E] shadow-sm">
                    Chia sẻ link
                  </button>
                </div>
              </div>

              <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4E6A4E] hover:underline">
                <span>⏱️</span>
                Xem lịch sử điểm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPromotion;
