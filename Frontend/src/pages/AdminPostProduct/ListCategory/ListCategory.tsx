import type UploadProduct from "@/model/UploadProduct";
import Category from "@/model/Category";
import publicAxios from "@/service/publicAxios";
import { useEffect, useState } from "react";

type Props = {
  categoryId: number;
  handleChange: <K extends keyof UploadProduct>(
    field: K,
    value: UploadProduct[K],
  ) => void;
};

function ListCategory({ categoryId, handleChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    publicAxios
      .get("/home/categories")
      .then((res) => {
        const data = (res.data as any[]).map(
          (item) => new Category(item.maTheLoai, item.tenTheLoai),
        );
        setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-2">
      <label className="font-semibold text-[15px]">Danh mục</label>
      <select
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-[#4d5e45] bg-white appearance-none"
        value={categoryId}
        onChange={(e) => handleChange("categoryId", Number(e.target.value))}
      >
        <option value={0} disabled>
          Danh mục
        </option>
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.tenDanhMuc}
          </option>
        ))}
      </select>
      {loading && <p className="text-sm text-gray-500">Đang tải danh mục...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default ListCategory;
