import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "@/components/common/Pagination";
import UserProductSellList from "./components/UserProductSellList";
import UserProductSellEditModal from "./components/UserProductSellEditModal";
import { activateSellerProduct, deactivateSellerProduct, getSellerProducts, mapSellerProductToCard, patchSellProduct, updateSellerProduct, type SellProduct, type SellerListingFilter } from "@/services/productSellerService";

const PAGE_SIZE = 6;
type ProductFilter = "ALL" | "ACTIVE" | "PENDING REVIEW" | "SOLD OUT";
const FILTER_TO_API: Record<ProductFilter, SellerListingFilter> = { ALL: "ALL", ACTIVE: "ACTIVE", "PENDING REVIEW": "PENDING", "SOLD OUT": "SOLD_OUT" };
const FILTER_TABS = [{ key: "ALL" as ProductFilter, label: "Tất cả" }, { key: "ACTIVE" as ProductFilter, label: "Đang bán" }, { key: "PENDING REVIEW" as ProductFilter, label: "Chờ duyệt" }, { key: "SOLD OUT" as ProductFilter, label: "Hết hàng" }];

function UserProductSell() {
  const [filter, setFilter] = useState<ProductFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState<SellProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [restockingId, setRestockingId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<SellProduct | null>(null);
  const hasLoadedOnce = useRef(false);

  const loadProducts = useCallback(async (silent = false) => {
    if (!silent && !hasLoadedOnce.current) setInitialLoading(true);
    else setIsRefreshing(true);
    setError(null);
    try {
      const res = await getSellerProducts(currentPage, PAGE_SIZE, FILTER_TO_API[filter]);
      const page = res.data;
      setProducts(page.content.map(mapSellerProductToCard));
      setTotalPages(Math.max(1, page.totalPages));
      hasLoadedOnce.current = true;
    } catch {
      if (!silent) { setProducts([]); setTotalPages(1); }
      setError("Không tải được danh sách sản phẩm.");
    } finally { setInitialLoading(false); setIsRefreshing(false); }
  }, [currentPage, filter]);

  useEffect(() => { loadProducts(hasLoadedOnce.current); }, [loadProducts]);

  const updateProductInList = (id: number, updater: (p: SellProduct) => SellProduct) => setProducts((prev) => prev.map((p) => p.id === id ? updater(p) : p));

  const handleToggleActive = async (product: SellProduct) => {
    if (!product.canToggleActive || togglingId !== null) return;
    const nextActive = !product.active; const previous = product;
    updateProductInList(product.id, (p) => patchSellProduct(p, { active: nextActive }));
    setTogglingId(product.id);
    try { if (nextActive) await activateSellerProduct(product.id); else await deactivateSellerProduct(product.id); }
    catch { updateProductInList(product.id, () => previous); setError("Không cập nhật được trạng thái."); }
    finally { setTogglingId(null); }
  };

  const handleRestock = async (product: SellProduct, addQuantity: number) => {
    const newQty = product.inStock + addQuantity; const previous = product;
    updateProductInList(product.id, (p) => patchSellProduct(p, { inStock: newQty }));
    setRestockingId(product.id);
    try { await updateSellerProduct(product.id, { soLuong: newQty }); if (filter === "SOLD OUT") await loadProducts(true); }
    catch { updateProductInList(product.id, () => previous); setError("Không nhập kho được."); }
    finally { setRestockingId(null); }
  };

  const handleEditSaved = (updated: SellProduct, imagesChanged: boolean) => {
    updateProductInList(updated.id, () => updated);
    if (imagesChanged || (filter === "SOLD OUT" && !updated.isSoldOut) || (filter === "ACTIVE" && updated.isSoldOut)) loadProducts(true);
  };

  return (
    <div className="min-h-screen bg-[#f9faf4] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8"><h1 className="text-2xl font-bold text-brand-heading">Sản phẩm đang bán</h1><p className="mt-1 text-sm text-gray-500">Quản lý và lọc sản phẩm bạn đã đăng</p></div>
        <div className="mb-8 flex flex-wrap gap-3">
          {FILTER_TABS.map(({ key, label }) => (
            <button key={key} type="button" onClick={() => { setCurrentPage(0); setFilter(key); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === key ? "bg-brand-primary text-white shadow-sm" : "bg-green-100 text-brand-primary hover:bg-green-200/80"}`}>{label}</button>
          ))}
        </div>
        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className={`transition-opacity duration-200 ${isRefreshing ? "opacity-60" : "opacity-100"}`}>
          {initialLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-xl bg-white/80 shadow-sm" />)}
            </div>
          ) : (
            <UserProductSellList products={products} togglingId={togglingId} restockingId={restockingId} onToggleActive={handleToggleActive} onEdit={setEditingProduct} onRestock={handleRestock} />
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} loading={initialLoading} />
        {editingProduct && <UserProductSellEditModal product={editingProduct} onClose={() => setEditingProduct(null)} onSaved={handleEditSaved} />}
      </div>
    </div>
  );
}

export default UserProductSell;
