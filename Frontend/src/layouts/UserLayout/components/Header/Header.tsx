import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Bell, Search, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import UserDropdown from "./UserDropdown/UserDropdown";
import publicAxios from "@/service/publicAxios";

interface SuggestItem {
  maSanPham: number;
  tenSanPham: string;
  giaSanPham: number;
  hinhAnhDaiDien?: string;
}

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const cartCount = useSelector(
    (state: RootState) => state.cart.cart?.tongSoLuong ?? 0,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  // Gợi ý tìm kiếm
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync header input với URL query param khi ở trang /search
  useEffect(() => {
    if (location.pathname === "/search") {
      setSearchValue(searchParams.get("query") || "");
    } else {
      setSearchValue("");
    }
  }, [location.pathname, searchParams]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce gọi API gợi ý
  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggest(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await publicAxios.get(
          `/products/search?keyword=${encodeURIComponent(value.trim())}&size=5`,
          { headers }
        );
        const items: SuggestItem[] =
          (res as { data: { content: SuggestItem[] } })?.data?.content ?? [];
        setSuggestions(items);
        setShowSuggest(items.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggest(false);
      } finally {
        setLoadingSuggest(false);
      }
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggest(false);
    const query = searchValue.trim();
    if (location.pathname === "/search") {
      const newParams = new URLSearchParams(searchParams);
      if (query) newParams.set("query", query);
      else newParams.delete("query");
      setSearchParams(newParams);
    } else {
      navigate(query ? `/search?query=${encodeURIComponent(query)}` : "/search");
    }
  };

  const handleSelectSuggest = (item: SuggestItem) => {
    setShowSuggest(false);
    setSearchValue(item.tenSanPham);
    navigate(`/product/${item.maSanPham}`);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-300 mx-auto px-6 h-18 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-[#4E6A4E]">
            <h1 className="text-2xl font-bold text-[#4E6A4E]">OReMA.vn</h1>
          </Link>
        </div>

        {/* SEARCH */}
        <div ref={wrapperRef} className="flex-1 px-10 relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center bg-[#F4F4F4] rounded-full px-4 h-11">
              <input
                type="text"
                placeholder="Tìm kiếm trên OReMa..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggest(true)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {loadingSuggest ? (
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <button
                  type="submit"
                  className="text-gray-500 hover:text-black transition-colors focus:outline-none flex items-center justify-center"
                >
                  <Search size={18} />
                </button>
              )}
            </div>
          </form>

          {/* Dropdown gợi ý */}
          {showSuggest && (
            <div className="absolute top-12 left-10 right-10 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden">
              {suggestions.map((item, idx) => (
                <button
                  key={item.maSanPham}
                  onMouseDown={() => handleSelectSuggest(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4FBEE] transition-colors text-left
                    ${idx < suggestions.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  {/* Ảnh sản phẩm */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.hinhAnhDaiDien ? (
                      <img
                        src={item.hinhAnhDaiDien}
                        alt={item.tenSanPham}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Tên + giá */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1C19] truncate">
                      {item.tenSanPham}
                    </p>
                    <p className="text-xs text-[#49613E] font-semibold">
                      {item.giaSanPham.toLocaleString("vi-VN")}đ
                    </p>
                  </div>

                  <Search size={14} className="text-gray-400 flex-shrink-0" />
                </button>
              ))}

              {/* Xem tất cả kết quả */}
              <button
                onMouseDown={handleSearchSubmit as unknown as React.MouseEventHandler}
                className="w-full px-4 py-3 text-sm text-[#49613E] font-semibold hover:bg-[#F4FBEE] transition-colors text-center border-t border-gray-100"
              >
                Xem tất cả kết quả cho "{searchValue}"
              </button>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link to="/login" className="text-sm font-medium text-[#4E6A4E]">
              Đăng nhập
            </Link>
          )}

          <Link to="/cart" className="relative text-gray-700 hover:text-black transition-colors">
            <ShoppingCart size={20} className="cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 bg-[#E74C3C] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-[3px]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Bell size={20} className="cursor-pointer" />

          <Link to="/selling-post" className="text-gray-700 hover:text-black transition-colors">
            <button className="bg-[#4E6A4E] text-white px-5 h-10 rounded-full font-medium hover:cursor-pointer">
              Đăng bán
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
