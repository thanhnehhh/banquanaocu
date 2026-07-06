import { Edit2, Trash2, RotateCcw } from "lucide-react";
import type { CategoryDTO } from "@/services/adminCategoryService";

interface AdminCategoriesTableProps {
  categories: CategoryDTO[];
  loading: boolean;
  onEdit: (category: CategoryDTO) => void;
  onDelete: (category: CategoryDTO) => void;
  onRestore: (category: CategoryDTO) => void;
}

const AdminCategoriesTable = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onRestore,
}: AdminCategoriesTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden mx-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="py-5 px-6 text-sm font-medium text-gray-500">
              Mã phân loại
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500">
              Tên phân loại
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">
              Số lượng sản phẩm
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">
              Active
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">
              Điều chỉnh
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-8 px-6 text-center text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <tr
                key={category.maTheLoai}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  !category.active ? "opacity-60 bg-gray-100" : ""
                }`}
              >
                <td className="py-6 px-6 text-sm font-bold text-brand-heading">
                  {category.maTheLoai}
                </td>
                <td className="py-6 px-6 text-sm text-gray-700">
                  {category.tenTheLoai}
                </td>
                <td className="py-6 px-6 text-sm text-center text-gray-600">
                  {category.soSanPham}
                </td>
                <td className="py-6 px-6 text-sm text-center text-gray-600">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${category.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {category.active ? "Hoạt động" : "Bị ẩn"}
                  </span>
                </td>
                <td className="py-6 px-6 text-sm text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={18} />
                    </button>

                    {!category.active ? (
                      <button
                        onClick={() => onRestore(category)}
                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                        title="Khôi phục"
                      >
                        <RotateCcw size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onDelete(category)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 px-6 text-center text-gray-500">
                Không tìm thấy phân loại nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategoriesTable;
