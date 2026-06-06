import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { taoReview } from "@/services/reviewService";

interface Props {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewModal = ({ maSanPham, tenSanPham, hinhAnh, onClose, onSuccess }: Props) => {
  const [diem, setDiem] = useState(0);
  const [hover, setHover] = useState(0);
  const [nhanXet, setNhanXet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (diem === 0) { setError("Vui lòng chọn số sao đánh giá."); return; }
    if (!nhanXet.trim()) { setError("Vui lòng nhập nhận xét."); return; }
    setLoading(true); setError(null);
    try {
      await taoReview({ maSanPham, diemXepHang: diem, nhanXet: nhanXet.trim() });
      onSuccess(); onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Đánh giá thất bại. Vui lòng thử lại.");
    } finally { setLoading(false); }
  };

  const starLabels = ["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Đánh giá sản phẩm</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50 rounded-xl">
          {hinhAnh && <img src={hinhAnh} alt={tenSanPham} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
          <p className="text-sm font-medium text-slate-700 line-clamp-2">{tenSanPham}</p>
        </div>
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="flex gap-2">
            {[1,2,3,4,5].map((star) => (
              <button key={star} type="button" onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => setDiem(star)} className="transition-transform hover:scale-125 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 transition-colors duration-150"
                  fill={star <= (hover || diem) ? "#FFA500" : "none"} stroke={star <= (hover || diem) ? "#FFA500" : "#D1D5DB"} strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
            ))}
          </div>
          {(hover || diem) > 0 && <span className="text-sm font-semibold text-[#FFA500]">{starLabels[hover || diem]}</span>}
        </div>
        <textarea value={nhanXet} onChange={(e) => setNhanXet(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn..." rows={4} maxLength={500}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E6A4E]/30 resize-none mb-1" />
        <p className="text-xs text-slate-400 text-right mb-4">{nhanXet.length}/500</p>
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Hủy</button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-3 bg-[#4E6A4E] hover:bg-[#3a5c31] text-white rounded-full text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
