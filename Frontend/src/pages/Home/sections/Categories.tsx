import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "@/services/homeService";
import type { Category } from "@/services/homeService";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((res) => {
        // Backend trả về { data: [...] } hoặc trực tiếp array
        const data = res.data
          ? Array.isArray(res.data)
            ? res.data
            : res.data.data || res.data
          : res;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/search?category=${categoryId}`);
  };

  const handleViewAll = () => {
    navigate("/search");
  };

  // Lấy 5 danh mục đầu tiên
  const displayedCategories = categories.slice(0, 5);

  if (loading) {
    return (
      <section className="bg-[#F5F5F3] py-16">
        <div className="w-full px-6 lg:px-10">
          <div className="text-center py-12 text-gray-500">
            Đang tải danh mục...
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="bg-[#F5F5F3] py-16">
        <div className="w-full px-6 lg:px-10">
          <div className="text-center py-12 text-gray-500">
            Không có danh mục nào
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F5F5F3] py-16">
      <div className="w-full px-6 lg:px-10">
        <h2 className="text-2xl font-semibold text-[#4E6A4E]">
          Danh mục nổi bật
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Khám phá thế giới thời trang qua lăng kính bền vững.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
          {displayedCategories.map((item) => (
            <div
              key={item.maTheLoai}
              onClick={() => handleCategoryClick(item.maTheLoai)}
              className="bg-white rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#E4E8E1] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-shirt"></i>
              </div>
              <span className="text-sm font-medium text-center line-clamp-2">
                {item.tenTheLoai}
              </span>
              <span className="text-xs text-gray-500">({item.soSanPham})</span>
            </div>
          ))}

          {/* Nút Xem tất cả */}
          <div
            onClick={handleViewAll}
            className="bg-white rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition cursor-pointer border-2 border-dashed border-[#4E6A4E]"
          >
            <div className="w-10 h-10 bg-[#4E6A4E] rounded-full flex items-center justify-center text-white">
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            <span className="text-sm font-medium text-center text-[#4E6A4E]">
              Xem tất cả
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
