/**
 * AI gợi ý sản phẩm dùng Google Gemini API (free tier)
 * Để dùng: lấy API key miễn phí tại https://aistudio.google.com/app/apikey
 * Sau đó điền vào VITE_GEMINI_API_KEY trong file .env
 */

export interface AISuggestion {
  title: string;
  reason: string;
  searchKeyword: string;
  categoryName?: string; // tên danh mục gợi ý để filter
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const getAISuggestions = async (product: {
  tenSanPham: string;
  tenTheLoai: string;
  giaSanPham: number;
  moTa?: string;
}): Promise<AISuggestion[]> => {
  if (!GEMINI_API_KEY) {
    return getFallbackSuggestions(product.tenSanPham, product.tenTheLoai);
  }

  const prompt = `Bạn là trợ lý mua sắm thời trang đồ cũ/secondhand tại Việt Nam.
Khách đang xem sản phẩm: "${product.tenSanPham}" (${product.tenTheLoai}), giá ${product.giaSanPham.toLocaleString("vi-VN")}đ.

Hãy gợi ý 3 loại sản phẩm thời trang secondhand cụ thể phù hợp để mặc kèm với "${product.tenSanPham}".
Gợi ý phải đa dạng, không trùng nhau, phù hợp với phong cách của sản phẩm trên.
Trả lời ĐÚNG định dạng JSON sau, không thêm gì khác:
[
  {"title": "tên gợi ý ngắn gọn", "reason": "lý do phù hợp với sản phẩm đang xem", "searchKeyword": "từ khóa tìm kiếm", "categoryName": "Áo hoặc Quần hoặc Váy & Đầm hoặc Áo khoác hoặc Phụ kiện"},
  {"title": "...", "reason": "...", "searchKeyword": "...", "categoryName": "..."},
  {"title": "...", "reason": "...", "searchKeyword": "...", "categoryName": "..."}
]
categoryName CHỈ được là 1 trong 5 giá trị: Áo, Quần, Váy & Đầm, Áo khoác, Phụ kiện`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      console.error("[AI] Gemini API error:", res.status, await res.text());
      throw new Error("Gemini API error: " + res.status);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("[AI] Gemini raw response:", text);

    // Parse JSON từ response — bỏ markdown code block nếu có
    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as AISuggestion[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("[AI] Parsed suggestions:", parsed);
        return parsed;
      }
    }
    console.warn("[AI] Could not parse JSON, using fallback");
    return getFallbackSuggestions(product.tenSanPham, product.tenTheLoai);
  } catch (e) {
    console.error("[AI] Exception:", e);
    return getFallbackSuggestions(product.tenSanPham, product.tenTheLoai);
  }
};

/** Fallback khi chưa có API key hoặc Gemini fail — dựa trên tên sản phẩm cụ thể */
const getFallbackSuggestions = (tenSanPham: string, category: string): AISuggestion[] => {
  const name = tenSanPham.toLowerCase();

  // Phân tích tên sản phẩm để gợi ý linh hoạt hơn
  if (name.includes("hoodie") || name.includes("sweater") || name.includes("nỉ")) {
    return [
      { title: "Quần jogger", reason: "Phối casual hoàn hảo với hoodie", searchKeyword: "quần jogger", categoryName: "Quần" },
      { title: "Quần jeans rách", reason: "Tạo sự tương phản thú vị với hoodie", searchKeyword: "quần jeans", categoryName: "Quần" },
      { title: "Giày sneaker", reason: "Hoàn thiện look streetwear", searchKeyword: "giày sneaker", categoryName: "Phụ kiện" },
    ];
  }
  if (name.includes("sơ mi") || name.includes("shirt")) {
    return [
      { title: "Quần tây", reason: "Tạo phong cách công sở lịch sự", searchKeyword: "quần tây", categoryName: "Quần" },
      { title: "Quần jeans slim", reason: "Smart casual dễ mặc đi chơi", searchKeyword: "quần jeans slim", categoryName: "Quần" },
      { title: "Áo khoác bomber", reason: "Layer thêm cho ngày trời mát", searchKeyword: "áo khoác bomber", categoryName: "Áo khoác" },
    ];
  }
  if (name.includes("vest") || name.includes("blazer")) {
    return [
      { title: "Áo thun trắng", reason: "Tạo nền đơn giản để vest nổi bật", searchKeyword: "áo thun trắng", categoryName: "Áo" },
      { title: "Quần tây ống đứng", reason: "Hoàn thiện bộ suit thanh lịch", searchKeyword: "quần tây", categoryName: "Quần" },
      { title: "Túi xách da", reason: "Phụ kiện sang trọng đi kèm vest", searchKeyword: "túi xách", categoryName: "Phụ kiện" },
    ];
  }
  if (name.includes("váy") || name.includes("đầm") || name.includes("skirt") || name.includes("dress")) {
    return [
      { title: "Áo thun tuck-in", reason: "Phối gọn gàng, tôn dáng với váy", searchKeyword: "áo thun", categoryName: "Áo" },
      { title: "Áo croptop", reason: "Tạo outfit năng động trẻ trung", searchKeyword: "áo croptop", categoryName: "Áo" },
      { title: "Áo khoác denim", reason: "Layer nhẹ nhàng phù hợp mọi thời tiết", searchKeyword: "áo khoác denim", categoryName: "Áo khoác" },
    ];
  }
  if (name.includes("jeans") || name.includes("jean") || category.includes("Quần")) {
    return [
      { title: "Áo thun oversize", reason: "Phối thoải mái, trẻ trung với jeans", searchKeyword: "áo thun oversize", categoryName: "Áo" },
      { title: "Áo sơ mi flannel", reason: "Phong cách casual Mỹ đặc trưng", searchKeyword: "áo sơ mi flannel", categoryName: "Áo" },
      { title: "Áo khoác denim", reason: "Double denim trend đang hot", searchKeyword: "áo khoác denim", categoryName: "Áo khoác" },
    ];
  }

  // Fallback theo danh mục
  const byCategory: Record<string, AISuggestion[]> = {
    "Áo": [
      { title: "Quần jeans", reason: "Phối hoàn hảo với mọi loại áo", searchKeyword: "quần jeans", categoryName: "Quần" },
      { title: "Quần wide-leg", reason: "Xu hướng mới, dễ phối", searchKeyword: "quần wide leg", categoryName: "Quần" },
      { title: "Áo khoác bomber", reason: "Layer thêm chiều sâu cho outfit", searchKeyword: "áo khoác bomber", categoryName: "Áo khoác" },
    ],
    "Quần": [
      { title: "Áo thun oversize", reason: "Phối thoải mái, trẻ trung", searchKeyword: "áo thun oversize", categoryName: "Áo" },
      { title: "Áo sơ mi trắng", reason: "Cổ điển, dễ phối với mọi loại quần", searchKeyword: "áo sơ mi trắng", categoryName: "Áo" },
      { title: "Áo khoác nhẹ", reason: "Thêm lớp layer tiện dụng", searchKeyword: "áo khoác", categoryName: "Áo khoác" },
    ],
    "Váy & Đầm": [
      { title: "Áo thun basic", reason: "Tuck-in gọn gàng với váy", searchKeyword: "áo thun", categoryName: "Áo" },
      { title: "Áo khoác denim", reason: "Phối casual trendy", searchKeyword: "áo khoác denim", categoryName: "Áo khoác" },
      { title: "Túi xách nhỏ", reason: "Hoàn thiện outfit nữ tính", searchKeyword: "túi xách", categoryName: "Phụ kiện" },
    ],
  };

  const key = Object.keys(byCategory).find(k => category?.includes(k));
  return byCategory[key || "Áo"];
};
