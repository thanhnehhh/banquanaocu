import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles, Store, ChevronRight } from "lucide-react";
import type { AppDispatch, RootState } from "@/redux/store";
import { addItemToCart } from "@/redux/cartSlice/cartSlice";
import { getProductDetail } from "@/services/productService";
import type { ProductDetailDTO } from "@/services/productService";
import { getProductsBySellerId } from "@/services/homeService";
import type { Product } from "@/services/homeService";
import { getAISuggestions } from "@/services/aiService";
import type { AISuggestion } from "@/services/aiService";
import CommentSection from "@/components/common/CommentSection";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [product, setProduct] = useState<ProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState<string | null>(null);

  // Sản phẩm cùng shop
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [loadingShop, setLoadingShop] = useState(false);

  // AI gợi ý
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setShopProducts([]);
    setAiSuggestions([]);

    getProductDetail(id)
      .then((res) => {
        const productData = (res as unknown as { data: ProductDetailDTO }).data || res;
        setProduct(productData as unknown as ProductDetailDTO);
        setSelectedImage(0);

        // Fetch sản phẩm cùng shop
        if ((productData as unknown as ProductDetailDTO).maNguoiBan) {
          setLoadingShop(true);
          getProductsBySellerId(
            (productData as unknown as ProductDetailDTO).maNguoiBan,
            Number(id),
            8
          )
            .then((r) => {
              const items = (r as unknown as { data: { data: Product[] } }).data?.data || [];
              setShopProducts(items);
            })
            .catch(() => setShopProducts([]))
            .finally(() => setLoadingShop(false));
        }

        // Fetch AI gợi ý
        setLoadingAI(true);
        getAISuggestions({
          tenSanPham: (productData as unknown as ProductDetailDTO).tenSanPham,
          tenTheLoai: (productData as unknown as ProductDetailDTO).tenTheLoai,
          giaSanPham: (productData as unknown as ProductDetailDTO).giaSanPham,
        })
          .then(setAiSuggestions)
          .catch(() => setAiSuggestions([]))
          .finally(() => setLoadingAI(false));
      })
      .catch(() => setError("Không thể tải thông tin sản phẩm."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (!product) return;
    if (value >= 1 && value <= product.soLuong) setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!product) return;
    setAddingToCart(true);
    try {
      await dispatch(addItemToCart({ maSanPham: product.maSanPham, soLuong: quantity })).unwrap();
      setCartMsg("Đã thêm vào giỏ hàng!");
      setTimeout(() => setCartMsg(null), 2500);
    } catch {
      setCartMsg("Thêm vào giỏ thất bại. Vui lòng thử lại.");
      setTimeout(() => setCartMsg(null), 2500);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!product) return;
    setAddingToCart(true);
    try {
      await dispatch(addItemToCart({ maSanPham: product.maSanPham, soLuong: quantity })).unwrap();
      navigate("/cart");
    } catch {
      setCartMsg("Có lỗi xảy ra. Vui lòng thử lại.");
      setTimeout(() => setCartMsg(null), 2500);
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-[#FFA500]" : "text-gray-300"}>★</span>
    ));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Đang tải sản phẩm...</p>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-lg">{error ?? "Sản phẩm không tồn tại."}</p>
    </div>
  );

  const images = product.hinhAnhs?.length > 0
    ? product.hinhAnhs
    : ["https://via.placeholder.com/500x500?text=No+Image"];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Toast */}
        {cartMsg && (
          <div className="fixed top-6 right-6 z-50 bg-[#49613E] text-white px-5 py-3 rounded-lg shadow-lg text-sm">
            {cartMsg}
          </div>
        )}

        {/* ── PRODUCT MAIN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-[#F9FAF4]">
              <div className="absolute top-3 left-3 bg-[#49613E] text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                {product.tenTheLoai}
              </div>
              <img src={images[selectedImage]} alt={product.tenSanPham} className="w-full h-[450px] object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? "border-[#49613E]" : "border-gray-200 hover:border-gray-300"}`}>
                    <img src={img} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-[32px] font-bold text-[#1A1C19] leading-tight">{product.tenSanPham}</h1>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(product.danhGia || 0)}</div>
                <span className="text-[14px] text-[#666]">
                  {(product.danhGia || 0).toFixed(1)} ({product.soLuongDanhGia || 0} đánh giá)
                </span>
              </div>
            </div>

            <div>
              <span className="text-[32px] font-bold text-[#49613E]">
                {(product.giaSanPham || 0).toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="border-t border-b border-[#E5E5E5] py-4 space-y-2">
              <p className="text-[14px] text-[#666]">
                <span className="font-semibold text-[#1A1C19]">Người bán: </span>
                {product.tenNguoiBan || product.email}
              </p>
              <p className="text-[14px] text-[#666]">
                <span className="font-semibold text-[#1A1C19]">Danh mục: </span>
                {product.tenTheLoai}
              </p>
              <p className="text-[14px]">
                <span className="font-semibold text-[#1A1C19]">Kho hàng: </span>
                {product.soLuong > 0
                  ? <span className="text-[#49613E]">Còn {product.soLuong} sản phẩm</span>
                  : <span className="text-[#E74C3C]">Đã hết hàng</span>}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1A1C19]">Số lượng</label>
              <div className="flex items-center border border-[#E5E5E5] rounded-lg w-fit">
                <button onClick={() => handleQuantityChange(quantity - 1)} className="px-4 py-2 text-[#666] hover:bg-[#F9FAF4]">−</button>
                <input type="number" value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-l border-r border-[#E5E5E5] py-2 focus:outline-none"
                  min="1" max={product.soLuong} />
                <button onClick={() => handleQuantityChange(quantity + 1)} className="px-4 py-2 text-[#666] hover:bg-[#F9FAF4]">+</button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleAddToCart} disabled={product.soLuong === 0 || addingToCart}
                className="flex-1 px-6 py-3 border-2 border-[#49613E] text-[#49613E] font-semibold rounded-lg hover:bg-[#F9FAF4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {addingToCart ? "Đang thêm..." : "🛒 Thêm vào giỏ"}
              </button>
              <button onClick={handleBuyNow} disabled={product.soLuong === 0 || addingToCart}
                className="flex-1 px-6 py-3 bg-[#49613E] text-white font-semibold rounded-lg hover:bg-[#3A4930] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        {/* ── AI GỢI Ý ── */}
        <div className="mb-10 bg-gradient-to-r from-[#F0F7EE] to-[#E8F5E3] rounded-2xl p-6 border border-[#C8DFC4]">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#49613E]" />
            <h2 className="text-[18px] font-bold text-[#1A1C19]">AI gợi ý cho bạn</h2>
            <span className="text-xs bg-[#49613E] text-white px-2 py-0.5 rounded-full">Beta</span>
          </div>

          {loadingAI ? (
            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 bg-white/60 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiSuggestions.map((s, i) => (
                <Link
                  key={i}
                  to={`/search?keyword=${encodeURIComponent(s.searchKeyword)}`}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group border border-transparent hover:border-[#49613E]/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#1A1C19] text-sm group-hover:text-[#49613E] transition-colors">
                        {s.title}
                      </p>
                      <p className="text-xs text-[#666] mt-1 leading-relaxed">{s.reason}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#49613E] flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="inline-block mt-2 text-xs text-[#49613E] bg-[#F0F7EE] px-2 py-0.5 rounded-full">
                    Tìm: {s.searchKeyword}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── SẢN PHẨM CÙNG SHOP ── */}
        {(loadingShop || shopProducts.length > 0) && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#49613E]" />
                <h2 className="text-[20px] font-bold text-[#1A1C19]">
                  Sản phẩm khác của{" "}
                  <span className="text-[#49613E]">{product.tenNguoiBan || product.email}</span>
                </h2>
              </div>
              <Link
                to={`/search`}
                className="text-sm text-[#49613E] hover:underline flex items-center gap-1"
              >
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingShop ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-xl" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {shopProducts.map((p) => (
                  <Link
                    key={p.maSanPham}
                    to={`/product/${p.maSanPham}`}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
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
                      {p.danhGia > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[#FFA500] text-xs">★</span>
                          <span className="text-xs text-gray-500">{p.danhGia.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ĐÁNH GIÁ ── */}
        <div className="border-t border-[#E5E5E5] pt-8">
          <h2 className="text-[24px] font-bold text-[#1A1C19] mb-6">
            Đánh giá từ khách hàng ({product.soLuongDanhGia || 0})
          </h2>
          {product.danhGias && product.danhGias.length > 0 ? (
            <div className="space-y-4">
              {product.danhGias.map((review) => (
                <div key={review.maDanhGia} className="border border-[#E5E5E5] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {review.avatarNguoiDung ? (
                      <img src={review.avatarNguoiDung} alt={review.tenNguoiDung} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#49613E] flex items-center justify-center text-white font-semibold text-sm">
                        {(review.tenNguoiDung || review.emailNguoiDung).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm text-[#1A1C19]">{review.tenNguoiDung || review.emailNguoiDung}</p>
                      <div className="flex">{renderStars(review.diemXepHang)}</div>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#666]">{review.nhanXet}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#999]">
              <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          )}
        </div>

        {/* ── BÌNH LUẬN ── */}
        <CommentSection maSanPham={product.maSanPham} />

      </div>
    </div>
  );
};

export default ProductDetail;
