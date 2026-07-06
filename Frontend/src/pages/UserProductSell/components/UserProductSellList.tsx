import { useState } from "react";
import {
  getDisplayStatusLabel,
  type SellProduct,
} from "@/services/productSellerService";

interface UserProductSellListProps {
  products: SellProduct[];
  togglingId: number | null;
  restockingId: number | null;
  onToggleActive: (product: SellProduct) => void;
  onEdit: (product: SellProduct) => void;
  onRestock: (product: SellProduct, addQuantity: number) => void;
}

const statusBadgeClass = (status: string) => {
  if (status === "ACTIVE") return "bg-green-600";
  if (status === "PENDING") return "bg-rose-700";
  if (status === "DEACTIVE") return "bg-amber-600";
  if (status === "REJECTED") return "bg-red-700";
  if (status === "SOLD OUT") return "bg-gray-500";
  return "bg-gray-500";
};

function UserProductSellList({
  products,
  togglingId,
  restockingId,
  onToggleActive,
  onEdit,
  onRestock,
}: UserProductSellListProps) {
  const [restockOpenId, setRestockOpenId] = useState<number | null>(null);
  const [restockQty, setRestockQty] = useState("");

  const closeRestock = () => {
    setRestockOpenId(null);
    setRestockQty("");
  };

  const handleRestockSubmit = (product: SellProduct) => {
    const addQty = parseInt(restockQty, 10);
    if (!addQty || addQty < 1) return;
    onRestock(product, addQty);
    closeRestock();
  };

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 py-16 text-center">
        <p className="text-lg font-medium text-brand-heading">
          Không có sản phẩm
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Thử bộ lọc khác hoặc đăng sản phẩm mới.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <article
          key={p.id}
          className="overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="relative h-64 overflow-hidden rounded-lg">
            <img
              src={p.image}
              alt={p.name}
              className="h-full w-full object-cover"
            />
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs text-white ${statusBadgeClass(p.displayStatus)}`}
            >
              {getDisplayStatusLabel(p.displayStatus)}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-brand-heading">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-400">SKU: {p.id}</p>
              </div>
              <p className="shrink-0 text-lg font-bold text-brand-heading">
                {p.price}
              </p>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p className="text-xs uppercase text-gray-400">Tồn kho</p>
              <p className="font-medium text-brand-heading">{p.inStock}</p>
            </div>

            {restockOpenId === p.id && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#51604B]/30 bg-[#f9faf4] p-2">
                <input
                  type="number"
                  min={1}
                  placeholder="Số lượng thêm"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  disabled={restockingId === p.id}
                  onClick={() => handleRestockSubmit(p)}
                  className="shrink-0 rounded-full bg-[#51604B] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3d4938] disabled:opacity-60"
                >
                  {restockingId === p.id ? "..." : "Xác nhận"}
                </button>
                <button
                  type="button"
                  onClick={closeRestock}
                  className="shrink-0 text-xs text-gray-500 hover:text-gray-700"
                >
                  Hủy
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onEdit(p)}
                className="flex-1 rounded-full border border-gray-200 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Chỉnh sửa
              </button>

              {p.isSoldOut ? (
                <button
                  type="button"
                  disabled={restockingId === p.id}
                  onClick={() => {
                    if (restockOpenId === p.id) return;
                    setRestockOpenId(p.id);
                    setRestockQty("");
                  }}
                  className="rounded-full bg-[#51604B] px-4 py-2 text-sm text-white transition hover:bg-[#3d4938] disabled:opacity-60"
                >
                  Nhập kho
                </button>
              ) : p.canToggleActive ? (
                <button
                  type="button"
                  disabled={togglingId === p.id}
                  onClick={() => onToggleActive(p)}
                  className={`rounded-full px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    p.active
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-[#51604B] hover:bg-[#3d4938]"
                  }`}
                >
                  {togglingId === p.id
                    ? "..."
                    : p.active
                      ? "Tạm ngừng"
                      : "Kích hoạt"}
                </button>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default UserProductSellList;
