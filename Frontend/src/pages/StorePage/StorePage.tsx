import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Store, Star, Package, Phone, MapPin } from "lucide-react";
import publicAxios from "@/service/publicAxios";

interface SellerInfo {
  maNguoiDung: number;
  hoTen: string;
  email: string;
  avatar?: string;
  soDienThoai?: string;
  diaChi?: string;
  soSanPham: number;
  danhGiaXepHang: number;
}

interface Product {
  maSanPham: number;
  tenSanPham: string;
  giaSanPham: number;
  hinhAnhDaiDien?: string;
  danhGia?: number;
  soLuong: number;
}

const StorePage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingSeller, setLoadingSeller] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!sellerId) return;

    setLoadingSeller(true);
    publicAxios
      .get(`/home/sellers/${sellerId}`)
      .then((res) => {
        const raw = res as { data: SellerInfo } | SellerInfo;
        const info = (raw as { data: SellerInfo }).data ?? (raw as SellerInfo);
        setSeller(info);
      })
      .catch(() => setSeller(null))
      .finally(() => setLoadingSeller(false));

    setLoadingProducts(true);
    publicAxios
      .get(`/home/sellers/${sellerId}/products?limit=100`)
      .then((res) => {
        const raw = res as { data: Product[] } | Product[];
        const items = Array.isArray(raw)
          ? raw
          : (raw as { data: Product[] }).data || [];
        setProducts(items);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [sellerId]);

  const displayedProducts = showAll ? products : products.slice(0, 8);

  if (loadingSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#49613E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Không tìm thấy thông tin shop.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAF4]">
      {/* Banner shop */}
      <div className="bg-[#1F3D2B] py-12">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0 bg-white/10">
            {seller.avatar ? (
              <img src={seller.avatar} alt={seller.hoTen} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                {seller.hoTen?.charAt(0)?.toUpperCase() || "S"}
              </div>
            )}
          </div>

          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Store size={18} className="opacity-70" />
              <span className="text-sm opacity-70">Shop của</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{seller.hoTen}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {seller.danhGiaXepHang.toFixed(1)} / 5
              </span>
              <span className="flex items-center gap-1">
                <Package size={14} />
                {seller.soSanPham} sản phẩm
              </span>
              {seller.soDienThoai && (
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  {seller.soDienThoai}
                </span>
              )}
              {seller.diaChi && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {seller.diaChi}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1A1C19]">
            Tất cả sản phẩm
            <span className="ml-2 text-sm font-normal text-gray-500">({products.length})</span>
          </h2>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Store size={48} className="mx-auto mb-3 opacity-30" />
            <p>Shop chưa có sản phẩm nào.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayedProducts.map((p) => (
                <Link key={p.maSanPham} to={`/product/${p.maSanPham}`}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden bg-[#F9FAF4]">
                    <img
                      src={p.hinhAnhDaiDien || "https://via.placeholder.com/300x300?text=No+Image"}
                      alt={p.tenSanPham}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#1A1C19] truncate group-hover:text-[#49613E] transition-colors">
                      {p.tenSanPham}
                    </p>
                    <p className="text-sm font-bold text-[#49613E] mt-1">
                      {p.giaSanPham.toLocaleString("vi-VN")}đ
                    </p>
                    {p.danhGia && p.danhGia > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs text-gray-500">{p.danhGia.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {products.length > 8 && (
              <div className="flex justify-center mt-8">
                <button onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 border border-[#49613E] text-[#49613E] rounded-full text-sm font-semibold hover:bg-[#F4FBEE] transition-colors">
                  {showAll ? "Thu gọn ↑" : `Xem thêm ${products.length - 8} sản phẩm ↓`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StorePage;
