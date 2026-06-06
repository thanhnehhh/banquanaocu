export interface AISuggestion {
  title: string;
  reason: string;
  searchKeyword: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const getAISuggestions = async (product: { tenSanPham: string; tenTheLoai: string; giaSanPham: number; moTa?: string; }): Promise<AISuggestion[]> => {
  if (!GEMINI_API_KEY) return getFallbackSuggestions(product.tenTheLoai);

  const prompt = `Bạn là trợ lý mua sắm thời trang đồ cũ/secondhand tại Việt Nam.
Khách đang xem sản phẩm: "${product.tenSanPham}" (${product.tenTheLoai}), giá ${product.giaSanPham.toLocaleString("vi-VN")}đ.
Hãy gợi ý 3 loại sản phẩm thời trang secondhand phù hợp để mặc kèm hoặc bổ sung cho outfit.
Trả lời ĐÚNG định dạng JSON sau, không thêm gì khác:
[{"title": "tên gợi ý ngắn", "reason": "lý do ngắn gọn 1 câu", "searchKeyword": "từ khóa tìm kiếm"},{"title": "...", "reason": "...", "searchKeyword": "..."},{"title": "...", "reason": "...", "searchKeyword": "..."}]`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 512 } }),
    });
    if (!res.ok) throw new Error("Gemini API error");
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as AISuggestion[];
    return getFallbackSuggestions(product.tenTheLoai);
  } catch { return getFallbackSuggestions(product.tenTheLoai); }
};

const getFallbackSuggestions = (category: string): AISuggestion[] => {
  const suggestions: Record<string, AISuggestion[]> = {
    default: [
      { title: "Áo thun basic", reason: "Dễ phối với nhiều loại trang phục", searchKeyword: "áo thun" },
      { title: "Quần jeans", reason: "Kinh điển, phù hợp mọi phong cách", searchKeyword: "quần jeans" },
      { title: "Áo khoác nhẹ", reason: "Hoàn thiện outfit theo mùa", searchKeyword: "áo khoác" },
    ],
    "Áo": [
      { title: "Quần jeans xanh", reason: "Phối hoàn hảo với áo mọi màu", searchKeyword: "quần jeans" },
      { title: "Chân váy midi", reason: "Tạo vẻ thanh lịch, nữ tính", searchKeyword: "chân váy" },
      { title: "Áo khoác bomber", reason: "Layer thêm để tạo chiều sâu outfit", searchKeyword: "áo khoác bomber" },
    ],
  };
  const key = Object.keys(suggestions).find(k => k !== "default" && category?.includes(k));
  return suggestions[key || "default"];
};
