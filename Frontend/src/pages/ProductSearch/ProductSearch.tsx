import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/cartSlice/cartSlice";
import type { AppDispatch } from "@/redux/store";
import { ShoppingCart } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Quantity state for add to cart
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  // Load initial data
  useEffect(() => {
    // Lấy danh sách sản phẩm — dùng publicAxios thay vì hardcode URL
    publicAxios.get(`/products/search`)
      .then((data: any) => {
        const productsData = data?.data?.content ?? data?.content ?? [];
        setAllProducts(productsData);
        setProducts(productsData);
      })
      .catch((err: any) => console.error("Lỗi products:", err));

    // Lấy danh mục + tình trạng
    Promise.all([
      publicAxios.get(`/home/categories`),
      publicAxios.get(`/statuses`),
    ])
      .then(([categoryData, statusData]: any[]) => {
        setCategories(categoryData?.data ?? categoryData ?? []);
        setStatuses(statusData?.data ?? statusData ?? []);
      })
      .catch((err: any) => console.error("Lỗi filters:", err));
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.maTheLoai || 0),
      );
    }

    // Filter by statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.maTinhTrang || 0),
      );
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter((item) => item.giaSanPham >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter((item) => item.giaSanPham <= max);
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.giaSanPham - b.giaSanPham);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.giaSanPham - a.giaSanPham);
    }
    // Default: "newest" - keep original order

    setProducts(filtered);
  }, [
    searchTerm,
    selectedCategories,
    selectedStatuses,
    minPrice,
    maxPrice,
    sortBy,
    allProducts,
  ]);

  // Handle category filter
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId),
    );
  };

  // Handle status filter
  const handleStatusChange = (statusId: number, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, statusId] : prev.filter((id) => id !== statusId),
    );
  };

  // Handle price filter
  const handleApplyPrice = () => {
    // This will trigger the useEffect above due to minPrice/maxPrice state change
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  // Handle quantity change
  const handleQuantityChange = (productId: number, value: string) => {
    const qty = parseInt(value) || 0;
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, Math.min(qty, 100)),
    }));
  };

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    const quantity = quantities[product.maSanPham] || 1;
    try {
      await dispatch(
        addItemToCart({
          maSanPham: product.maSanPham,
          soLuong: quantity,
        }),
      );
      alert(`Đã thêm "${product.tenSanPham}" vào giỏ hàng!`);
      setQuantities((prev) => ({
        ...prev,
        [product.maSanPham]: 1,
      }));
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      alert("Không thể thêm vào giỏ hàng. Vui lòng đăng nhập!");
    }
  };

  return (
    <div className="bg-[#F9FAF4] min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* SEARCH BAR */}
        <div className="mb-8 flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm áo khoác, quần jean, phụ kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#49613E] shadow-sm"
          />

          <button
            onClick={() => {
              // Search is already triggered by useEffect
            }}
            className="px-8 py-4 bg-[#49613E] text-white rounded-full font-bold cursor-pointer hover:bg-[#3a4d31] transition-all"
          >
            Tìm kiếm
          </button>
        </div>

        <div className="flex gap-8">
          {/* FILTER SIDEBAR */}
          <div className="w-[280px] flex-shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1A1C19]">Bộ Lọc</h2>

              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-[#49613E] cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            </div>

            {/* CATEGORY FILTER */}
            <div className="mb-6 border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-[#1A1C19] mb-4">Danh mục</h3>

              <div className="space-y-3">
                {categories.map((item) => (
                  <label
                    key={item.maTheLoai}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(item.maTheLoai)}
                      onChange={(e) =>
                        handleCategoryChange(item.maTheLoai, e.target.checked)
                      }
                      className="w-4 h-4 accent-[#49613E] cursor-pointer"
                    />

                    <span className="text-gray-700">{item.tenTheLoai}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* STATUS FILTER */}
            <div className="mb-6 border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-[#1A1C19] mb-4">Tình trạng</h3>

              <div className="space-y-3">
                {statuses.map((item) => (
                  <label
                    key={item.maTinhTrang}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(item.maTinhTrang)}
                      onChange={(e) =>
                        handleStatusChange(item.maTinhTrang, e.target.checked)
                      }
                      className="w-4 h-4 accent-[#49613E] cursor-pointer"
                    />

                    <span className="text-gray-700">{item.tenTinhTrang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE FILTER */}
            <div>
              <h3 className="font-semibold text-[#1A1C19] mb-4">Khoảng giá</h3>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="TỪ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:border-[#49613E]"
                />

                <span>-</span>

                <input
                  type="text"
                  placeholder="ĐẾN"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:border-[#49613E]"
                />
              </div>

              <button
                onClick={handleApplyPrice}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all cursor-pointer"
              >
                Áp dụng giá
              </button>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-bold text-[#1A1C19]">
                Kết quả tìm kiếm ({products.length} sản phẩm)
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-gray-600">Sắp xếp theo:</span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-[#49613E] cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((item) => (
                <div
                  key={item.maSanPham}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-[250px] overflow-hidden relative">
                    <div className="absolute top-2 left-2 bg-[#49613E] text-white text-xs font-bold px-2 py-1 rounded">
                      {item.tenTinhTrang}
                    </div>

                    <img
                      src={
                        item.hinhAnhDaiDien
                          ? item.hinhAnhDaiDien
                          : "/images/placeholder.jpg"
                      }
                      alt={item.tenSanPham}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-gray-800 font-semibold truncate mb-2">
                      {item.tenSanPham}
                    </h3>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[#49613E] font-bold text-lg">
                        {item.giaSanPham}đ
                      </span>

                      <span className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded">
                        SL: {item.soLuong}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max={item.soLuong}
                        value={quantities[item.maSanPham] || 1}
                        onChange={(e) =>
                          handleQuantityChange(item.maSanPham, e.target.value)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-[#49613E]"
                      />
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center bg-[#49613E] text-white text-sm font-semibold rounded py-2 hover:bg-[#3a4d31] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={item.soLuong === 0}
                      >
                        {item.soLuong === 0 ? (
                          "Hết hàng"
                        ) : (
                          <ShoppingCart size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
