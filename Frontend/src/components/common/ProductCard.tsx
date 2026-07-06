import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import { addItemToCart } from "@/redux/cartSlice/cartSlice";
import type { AppDispatch, RootState } from "@/redux/store";

type Props = {
  id: number;
  title: string;
  price: string;
  seller: string;
  image: string;
  tag?: string;
  maxQuantity?: number;
};

type ToastType = "success" | "error" | null;

const ProductCard = ({ id, title, price, seller, image, tag, maxQuantity = 1 }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; msg: string }>({ type: null, msg: "" });

  const showToast = (type: ToastType, msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: null, msg: "" }), 2500);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast("error", "Không thể thêm vào giỏ hàng. Vui lòng đăng nhập!");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ maSanPham: id, soLuong: quantity })).unwrap();
      showToast("success", `Đã thêm "${title}" vào giỏ hàng!`);
      setQuantity(1);
    } catch {
      showToast("error", "Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(value, maxQuantity)));
  };

  return (
    <div className="block cursor-pointer group relative">
      {/* Toast notification */}
      {toast.type && createPortal(
        <div
          className={`
            fixed top-5 right-5 z-50
            flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg
            text-white text-sm font-medium transition-all
            ${toast.type === "success" ? "bg-[#49613E]" : "bg-red-500"}
          `}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>,
        document.body
      )}

      <Link to={`/product/${id}`} className="space-y-2 block">
        <div className="relative rounded-xl overflow-hidden">
          {tag && (
            <span className="absolute top-2 left-2 bg-white text-xs px-2 py-1 rounded-full z-10">
              {tag}
            </span>
          )}
          <img
            src={image}
            alt={title}
            className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="text-sm font-medium group-hover:text-[#49613E] transition-colors truncate">
          {title}
        </h3>
        <p className="font-semibold">{price}</p>
        <p className="text-xs text-gray-500">by {seller}</p>
      </Link>

      <div className="flex gap-2 mt-3" onClick={(e) => e.preventDefault()}>
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={handleQuantityChange}
          onClick={(e) => e.stopPropagation()}
          className="w-12 border border-gray-300 rounded px-2 py-1 text-center text-xs focus:outline-none focus:border-[#49613E]"
        />
        <button
          onClick={handleAddToCart}
          disabled={isAdding || maxQuantity === 0}
          className="flex-1 flex items-center justify-center bg-[#49613E] text-white text-xs font-semibold rounded py-1 hover:bg-[#3a4d31] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {maxQuantity === 0 ? "Hết hàng" : isAdding ? "..." : <ShoppingCart size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
