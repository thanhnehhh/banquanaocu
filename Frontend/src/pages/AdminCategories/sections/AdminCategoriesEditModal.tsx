import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CategoryDTO } from "@/services/adminCategoryService";

interface AdminCategoriesEditModalProps {
  isOpen: boolean;
  category: CategoryDTO | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (maTheLoai: number, categoryData: Omit<CategoryDTO, "maTheLoai" | "soSanPham">) => void;
}

const AdminCategoriesEditModal = ({
  isOpen,
  category,
  isSaving,
  onClose,
  onSave,
}: AdminCategoriesEditModalProps) => {
  const [tenTheLoai, setTenTheLoai] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setTenTheLoai(category.tenTheLoai);
      setActive(category.active ?? true);
      setError("");
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!tenTheLoai.trim()) {
      setError("Tên phân loại không được bỏ trống");
      return;
    }
    onSave(category.maTheLoai, { tenTheLoai: tenTheLoai.trim(), active });
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-brand-heading">Chỉnh sửa phân loại</h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã phân loại
            </label>
            <input
              type="text"
              value={category.maTheLoai}
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên phân loại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tenTheLoai}
              onChange={(e) => {
                setTenTheLoai(e.target.value);
                if (error) setError("");
              }}
              placeholder="Nhập tên phân loại"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSaving}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái hoạt động <span className="text-red-500">*</span>
            </label>
            <select
              value={active ? "1" : "0"}
              onChange={(e) => setActive(e.target.value === "1")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={isSaving}
            >
              <option value="1">Đang hoạt động</option>
              <option value="0">Bị ẩn</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-[#3b4d31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoriesEditModal;
