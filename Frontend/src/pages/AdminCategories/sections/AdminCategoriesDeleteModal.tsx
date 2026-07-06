import type { CategoryDTO } from "@/services/adminCategoryService";

interface AdminCategoriesDeleteModalProps {
  isOpen: boolean;
  category: CategoryDTO | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AdminCategoriesDeleteModal = ({
  isOpen,
  category,
  isDeleting,
  onClose,
  onConfirm,
}: AdminCategoriesDeleteModalProps) => {
  if (!isOpen || !category) return null;

  const hasProducts = category.soSanPham > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-brand-heading">
            Xác nhận xóa phân loại
          </h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-2">
            Bạn có chắc chắn muốn xóa phân loại:
          </p>
          <p className="text-lg font-bold text-brand-heading mb-4">
            {category.tenTheLoai}
          </p>
          <p className="text-xs text-gray-500">
            Số lượng sản phẩm hiện tại: {category.soSanPham}
          </p>
          {hasProducts ? (
            <p className="text-sm text-red-600 font-semibold mt-4">
              ⚠️ Không thể xóa phân loại này vì vẫn còn sản phẩm đang thuộc phân loại! Vui lòng chuyển các sản phẩm này sang phân loại khác trước khi xóa.
            </p>
          ) : (
            <p className="text-sm text-red-600 font-semibold mt-4">
              ⚠️ Hành động này không thể được hoàn tác!
            </p>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:bg-gray-400 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting || hasProducts}
            className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
              hasProducts
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
            }`}
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesDeleteModal;
