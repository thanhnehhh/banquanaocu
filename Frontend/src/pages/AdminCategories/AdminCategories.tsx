import { useEffect, useState } from "react";
import {
  getCategories,
  searchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/adminCategoryService";
import type { CategoryDTO } from "@/services/adminCategoryService";
import AdminCategoriesTable from "./sections/AdminCategoriesTable";
import AdminCategoriesPagination from "./sections/AdminCategoriesPagination";
import AdminCategoriesCreateModal from "./sections/AdminCategoriesCreateModal";
import AdminCategoriesEditModal from "./sections/AdminCategoriesEditModal";
import AdminCategoriesDeleteModal from "./sections/AdminCategoriesDeleteModal";

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDTO | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  // Load danh mục từ API
  const loadCategories = async (page: number, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (search && search.trim()) {
        response = await searchCategories(search, page, pageSize);
      } else {
        response = await getCategories(page, pageSize);
      }

      const data = response.data;
      setCategories(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Lỗi tải danh sách phân loại:", err);
      setError("Không thể tải danh sách phân loại");
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu ban đầu
  useEffect(() => {
    loadCategories(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
    if (value.trim()) {
      loadCategories(0, value);
    } else {
      loadCategories(0);
    }
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (category: CategoryDTO) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Lưu chỉnh sửa danh mục
  const handleSaveEdit = async (
    maTheLoai: number,
    categoryData: Omit<CategoryDTO, "maTheLoai" | "soSanPham">
  ) => {
    setIsSaving(true);
    try {
      await updateCategory(maTheLoai, categoryData);
      showToast("success", "Cập nhật phân loại thành công!");
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      loadCategories(currentPage, searchTerm);
    } catch (err) {
      console.error("Lỗi cập nhật phân loại:", err);
      showToast("error", "Không thể cập nhật phân loại. Tên có thể đã tồn tại!");
    } finally {
      setIsSaving(false);
    }
  };

  // Mở modal xác nhận xóa
  const handleOpenDeleteModal = (category: CategoryDTO) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Xác nhận xóa danh mục
  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      setIsDeleting(true);
      try {
        await deleteCategory(categoryToDelete.maTheLoai);
        showToast("success", "Xóa phân loại thành công!");
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        // Load lại trang trước đó nếu trang hiện tại bị trống sau khi xóa
        const isLastItem = categories.length === 1;
        const newPage = isLastItem && currentPage > 0 ? currentPage - 1 : currentPage;
        loadCategories(newPage, searchTerm);
      } catch (err) {
        console.error("Lỗi xóa phân loại:", err);
        showToast("error", "Không thể xóa phân loại. Vui lòng thử lại!");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Xử lý khôi phục danh mục
  const handleRestoreCategory = async (category: CategoryDTO) => {
    try {
      await updateCategory(category.maTheLoai, {
        tenTheLoai: category.tenTheLoai,
        active: true,
      });
      showToast("success", "Khôi phục phân loại thành công!");
      loadCategories(currentPage, searchTerm);
    } catch (err) {
      console.error("Lỗi khôi phục phân loại:", err);
      showToast("error", "Không thể khôi phục phân loại. Vui lòng thử lại!");
    }
  };

  // Xử lý tạo danh mục mới
  const handleCreateCategory = async (
    categoryData: Omit<CategoryDTO, "maTheLoai" | "soSanPham">
  ) => {
    setIsCreating(true);
    try {
      await createCategory(categoryData);
      showToast("success", "Tạo phân loại thành công!");
      setIsCreateModalOpen(false);
      setCurrentPage(0);
      loadCategories(0, "");
    } catch (err) {
      console.error("Lỗi tạo phân loại:", err);
      showToast("error", "Không thể tạo phân loại. Tên có thể đã tồn tại!");
    } finally {
      setIsCreating(false);
    }
  };

  // Chuyển trang
  const handlePageChange = (page: number) => {
    loadCategories(page, searchTerm);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pt-4 pb-8">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-brand-primary" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-3 text-sm px-4">
        <span className="text-gray-500">Kênh ADMIN</span>
        <span className="text-gray-400 font-bold">›</span>
        <span className="font-bold text-brand-heading">Quản lý phân loại</span>
      </div>

      {/* 2. Tiêu đề */}
      <h2 className="text-2xl font-bold text-center text-brand-heading">
        Quản lý phân loại
      </h2>

      {/* 3. Thanh Tìm kiếm và nút Thêm */}
      <div className="flex justify-between items-center px-4 gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm phân loại theo tên..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-6 pr-12 py-3 bg-[#F3F4F1] border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary transition-colors"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Nút Thêm Phân Loại */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>Thêm phân loại</span>
        </button>

        {/* Thông tin trang */}
        <div className="text-sm text-gray-600">
          {loading ? (
            <span>Đang tải...</span>
          ) : (
            <span>
              Tổng: {totalElements} phân loại | Trang {currentPage + 1}/{totalPages}
            </span>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 4. Table Component */}
      <AdminCategoriesTable
        categories={categories}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onRestore={handleRestoreCategory}
      />

      {/* 5. Pagination Component */}
      <AdminCategoriesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* Create Modal Component */}
      <AdminCategoriesCreateModal
        isOpen={isCreateModalOpen}
        isCreating={isCreating}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCategory}
      />

      {/* Edit Modal Component */}
      <AdminCategoriesEditModal
        isOpen={isEditModalOpen}
        category={selectedCategory}
        isSaving={isSaving}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Delete Modal Component */}
      <AdminCategoriesDeleteModal
        isOpen={isDeleteModalOpen}
        category={categoryToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminCategories;
