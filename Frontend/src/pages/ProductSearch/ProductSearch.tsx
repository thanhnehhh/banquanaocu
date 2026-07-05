import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { addItemToCart } from "@/redux/cartSlice/cartSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { ShoppingCart, Camera } from "lucide-react";
import publicAxios from "@/service/publicAxios";

interface Product {
  maSanPham: number;
  tenSanPham: string;
  giaSanPham: number;
  soLuong: number;
  tenTinhTrang: string;
  hinhAnhDaiDien: string;
  maTheLoai?: number;
  maTinhTrang?: number;
}

interface Category { maTheLoai: number; tenTheLoai: string; }
interface Status { maTinhTrang: number; tenTinhTrang: string; }

const ProductSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") || "";
  const [sortBy, setSortBy] = useState("newest");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearchingByImage, setIsSearchingByImage] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const getInitialCategories = () => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const id = parseInt(categoryParam, 10);
      if (!isNaN(id)) return [id];
    }
    return [];
  };

  const [selectedCategories, setSelectedCategories] = useState<number[]>(getInitialCategories());
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    Promise.all([publicAxios.get("/home/categories"), publicAxios.get("/statuses")])
      .then(([catRes, statRes]) => {
        const catAny = catRes as any;
        const statAny = statRes as any;
        setCategories(catAny?.data ?? catAny ?? []);
        setStatuses(statAny?.data ?? statAny ?? []);
      })
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("keyword", searchTerm.trim());
      selectedCategories.forEach((id) => params.append("categoryId", String(id)));
      selectedStatuses.forEach((id) => params.append("statusId", String(id)));
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("size", "50");

      if (sortBy === "price-asc") { params.set("sort", "giaSanPham"); params.set("direction", "ASC"); }
      else if (sortBy === "price-desc") { params.set("sort", "giaSanPham"); params.set("direction", "DESC"); }
      else { params.set("sort", "maSanPham"); params.set("direction", "DESC"); }

      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await publicAxios.get(`/products/search?${params.toString()}`, { headers });
      const resAny = res as any;
      const fetched: Product[] = resAny?.data?.content ?? resAny?.content ?? [];
      setProducts(fetched.filter((item) => item.soLuong > 0));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategories, selectedStatuses, minPrice, maxPrice, sortBy]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleCategoryChange = (id: number, checked: boolean) =>
    setSelectedCategories((prev) => checked ? [...prev, id] : prev.filter((c) => c !== id));

  const handleStatusChange = (id: number, checked: boolean) =>
    setSelectedStatuses((prev) => checked ? [...prev, id] : prev.filter((s) => s !== id));

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("query");
    setSearchParams(newParams);
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setUploadedImage(null);
    setImagePreview(null);
  };

  const hasActiveFilters = useMemo(() =>
    selectedCategories.length > 0 || selectedStatuses.length > 0 ||
    minPrice !== "" || maxPrice !== "" || sortBy !== "newest" ||
    searchTerm.trim() !== "" || uploadedImage !== null,
    [selectedCategories, selectedStatuses, minPrice, maxPrice, sortBy, searchTerm, uploadedImage]);

  const handleQuantityChange = (productId: number, value: string) => {
    const qty = parseInt(value) || 1;
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, Math.min(qty, 100)) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Kích thước ảnh vượt quá giới hạn (tối đa 5MB)!");
      e.target.value = "";
      return;
    }
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSearchByImage = async () => {
    if (!uploadedImage) return;
    setIsSearchingByImage(true);
    const formData = new FormData();
    formData.append("image", uploadedImage);
    formData.append("threshold", "0.4");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/products/search-by-image", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        showToast("error", res.status === 413 ? "Kích thước ảnh quá lớn!" : "Lỗi khi tìm kiếm hình ảnh!");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setProducts((data.data || []).filter((item: Product) => item.soLuong > 0));
        showToast("success", "Đã tìm thấy các sản phẩm tương tự!");
      } else {
        showToast("error", data.message || "Lỗi khi tìm kiếm hình ảnh!");
      }
    } catch {
      showToast("error", "Không thể kết nối đến máy chủ!");
    } finally {
      setIsSearchingByImage(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      showToast("error", "Không thể thêm vào giỏ hàng. Vui lòng đăng nhập!");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }
    const quantity = quantities[product.maSanPham] || 1;
    try {
      await dispatch(addItemToCart({ maSanPham: product.maSanPham, soLuong: quantity })).unwrap();
      showToast("success", `Đã thêm "${product.tenSanPham}" vào giỏ hàng!`);
      setQuantities((prev) => ({ ...prev, [product.maSanPham]: 1 }));
    } catch {
      showToast("error", "Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="bg-[#F9FAF4] min-h-screen py-8">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-[#49613E]" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Image search */}
        <div className="mb-8 space-y-4">
          <div className="flex justify-end">
            <label className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-[#49613E] hover:border-[#49613E] hover:bg-[#F4FBEE] cursor-pointer transition-all shadow-sm">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Camera className="w-5 h-5" />
              <span className="text-sm font-semibold">Tìm kiếm bằng hình ảnh</span>
            </label>
          </div>
          {imagePreview && (
            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200">
              <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
              <p className="flex-1 text-sm text-gray-700 font-semibold">Tìm sản phẩm tương tự</p>
              <button onClick={handleSearchByImage} disabled={isSearchingByImage}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
                {isSearchingByImage ? "Đang tìm..." : "Tìm kiếm"}
              </button>
              <button onClick={() => { setUploadedImage(null); setImagePreview(null); fetchProducts(); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-full transition-all">✕</button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="w-[280px] flex-shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1A1C19]">Bộ Lọc</h2>
              <button onClick={handleClearFilters} disabled={!hasActiveFilters}
                className={`text-sm transition-all ${hasActiveFilters ? "text-[#49613E] font-bold bg-[#F4FBEE] border border-[#49613E]/30 px-3 py-1 rounded-full hover:bg-[#49613E] hover:text-white cursor-pointer shadow-sm" : "text-gray-300 cursor-not-allowed pointer-events-none"}`}>
                Xóa bộ lọc
              </button>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-[#1A1C19] mb-4">Danh mục</h3>
              <div className="space-y-3">
                {categories.map((item) => (
                  <label key={item.maTheLoai} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={selectedCategories.includes(item.maTheLoai)}
                      onChange={(e) => handleCategoryChange(item.maTheLoai, e.target.checked)}
                      className="w-4 h-4 accent-[#49613E] cursor-pointer" />
                    <span className="text-gray-700">{item.tenTheLoai}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-[#1A1C19] mb-4">Tình trạng</h3>
              <div className="space-y-3">
                {statuses.map((item) => (
                  <label key={item.maTinhTrang} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={selectedStatuses.includes(item.maTinhTrang)}
                      onChange={(e) => handleStatusChange(item.maTinhTrang, e.target.checked)}
                      className="w-4 h-4 accent-[#49613E] cursor-pointer" />
                    <span className="text-gray-700">{item.tenTinhTrang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A1C19] mb-4">Khoảng giá</h3>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="TỪ" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:border-[#49613E]" />
                <span>-</span>
                <input type="text" placeholder="ĐẾN" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:border-[#49613E]" />
              </div>
              <button onClick={fetchProducts}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all cursor-pointer">
                Áp dụng giá
              </button>
            </div>
          </div>

          {/* Product list */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-bold text-[#1A1C19]">
                {loading ? "Đang tìm kiếm..." : `Kết quả tìm kiếm (${products.length} sản phẩm)`}
                {searchTerm && !loading && <span className="text-base font-normal text-gray-500 ml-2">cho "{searchTerm}"</span>}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Sắp xếp theo:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-[#49613E] cursor-pointer">
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-[250px] bg-gray-200" />
                    <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">Không tìm thấy sản phẩm nào.</p>
                <p className="text-sm mt-1">Thử từ khóa khác hoặc xóa bộ lọc.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((item) => (
                  <div key={item.maSanPham} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <Link to={`/product/${item.maSanPham}`} className="block">
                      <div className="h-[250px] overflow-hidden relative">
                        <div className="absolute top-2 left-2 bg-[#49613E] text-white text-xs font-bold px-2 py-1 rounded z-10">
                          {item.tenTinhTrang}
                        </div>
                        <img src={item.hinhAnhDaiDien || "/images/placeholder.jpg"} alt={item.tenSanPham}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="px-4 pt-4 pb-2">
                        <h3 className="text-gray-800 font-semibold truncate mb-1 group-hover:text-[#49613E] transition-colors">{item.tenSanPham}</h3>
                        <span className="text-[#49613E] font-bold text-lg">{item.giaSanPham.toLocaleString("vi-VN")}đ</span>
                      </div>
                    </Link>
                    <div className="flex gap-2 px-4 pb-4">
                      <input type="number" min="1" max={item.soLuong} value={quantities[item.maSanPham] || 1}
                        onChange={(e) => handleQuantityChange(item.maSanPham, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-[#49613E]" />
                      <button onClick={() => handleAddToCart(item)} disabled={item.soLuong === 0}
                        className="flex-1 flex items-center justify-center bg-[#49613E] text-white text-sm font-semibold rounded py-2 hover:bg-[#3a4d31] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {item.soLuong === 0 ? "Hết hàng" : <ShoppingCart size={20} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
