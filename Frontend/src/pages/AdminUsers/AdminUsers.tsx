import { useEffect, useState } from "react";
import {
  getUsers,
  searchUsers,
  updateUserStatus,
  deleteUser,
  getHiddenUsers,
  searchHiddenUsers,
} from "@/services/adminUserService";
import type { User } from "@/services/adminUserService";
import AdminUsersTable from "./sections/AdminUsersTable";
import AdminUsersPagination from "./sections/AdminUsersPagination";
import AdminUsersDetailModal from "./sections/AdminUsersDetailModal";
import AdminUsersDeleteModal from "./sections/AdminUsersDeleteModal";

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState<"active" | "hidden">("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [tempStatus, setTempStatus] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  // Load người dùng từ API
  const loadUsers = async (page: number, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (activeTab === "active") {
        if (search && search.trim()) {
          response = await searchUsers(search, page, pageSize);
        } else {
          response = await getUsers(page, pageSize);
        }
      } else {
        if (search && search.trim()) {
          response = await searchHiddenUsers(search, page, pageSize);
        } else {
          response = await getHiddenUsers(page, pageSize);
        }
      }

      const data = response.data;
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Lỗi tải danh sách người dùng:", err);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu ban đầu
  useEffect(() => {
    const initLoad = async () => {
      await loadUsers(0);
    };
    initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
    if (value.trim()) {
      loadUsers(0, value);
    } else {
      loadUsers(0);
    }
  };

  // Mở modal xem chi tiết
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setTempStatus(user.trangThai);
    setIsDetailModalOpen(true);
  };

  // Mở modal xác nhận xóa
  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        await deleteUser(userToDelete.maNguoiDung);
        showToast("success", "Xóa người dùng thành công!");
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        loadUsers(currentPage, searchTerm);
      } catch (err) {
        console.error("Lỗi xóa người dùng:", err);
        showToast("error", "Không thể xóa người dùng. Vui lòng thử lại!");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Lưu thay đổi trạng thái
  const handleSaveStatus = async () => {
    if (selectedUser && selectedUser.trangThai !== tempStatus) {
      setIsSaving(true);
      try {
        await updateUserStatus(selectedUser.maNguoiDung, tempStatus);
        showToast("success", "Cập nhật trạng thái thành công!");
        setIsDetailModalOpen(false);
        setSelectedUser(null);
        loadUsers(currentPage, searchTerm);
      } catch (err) {
        console.error("Lỗi cập nhật trạng thái:", err);
        showToast("error", "Không thể cập nhật trạng thái. Vui lòng thử lại!");
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsDetailModalOpen(false);
      setSelectedUser(null);
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (page: number) => {
    loadUsers(page, searchTerm);
  };

  const tabTitle =
    activeTab === "active" ? "Quản lý tài khoản hoạt động" : "Quản lý tài khoản bị ẩn";

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pt-4 pb-8">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-[#49613E]" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-3 text-sm px-4">
        <span className="text-gray-500">Kênh ADMIN</span>
        <span className="text-gray-400 font-bold">›</span>
        <span className="font-bold text-brand-heading">Quản lý người dùng</span>
      </div>

      {/* 2. Tiêu đề */}
      <h2 className="text-2xl font-bold text-center text-brand-heading">
        Quản lý người dùng
      </h2>

      {/* Tabs */}
      <div className="px-4 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setActiveTab("active");
              setSearchTerm("");
              setCurrentPage(0);
            }}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "active"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Tài Khoản Hoạt Động
          </button>
          <button
            onClick={() => {
              setActiveTab("hidden");
              setSearchTerm("");
              setCurrentPage(0);
            }}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "hidden"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Tài Khoản Bị Ẩn
          </button>
        </div>
      </div>

      {/* 3. Tiêu đề Tab */}
      <h3 className="text-xl font-semibold text-brand-heading px-4">{tabTitle}</h3>

      {/* 4. Thanh Tìm kiếm */}
      <div className="flex justify-between items-center px-4">
        <div className="relative w-100">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
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

        {/* Thông tin trang */}
        <div className="text-sm text-gray-600">
          {loading ? (
            <span>Đang tải...</span>
          ) : (
            <span>
              Tổng: {totalElements} người dùng | Trang {currentPage + 1}/{totalPages}
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

      {/* 5. Table Component */}
      <AdminUsersTable
        users={users}
        loading={loading}
        onViewDetails={handleViewDetails}
        onDelete={handleOpenDeleteModal}
      />

      {/* 6. Pagination Component */}
      <AdminUsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* Detail Modal Component */}
      <AdminUsersDetailModal
        isOpen={isDetailModalOpen}
        user={selectedUser}
        tempStatus={tempStatus}
        isSaving={isSaving}
        isHidden={activeTab === "hidden"}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        onStatusChange={setTempStatus}
        onSave={handleSaveStatus}
      />

      {/* Delete Modal Component */}
      <AdminUsersDeleteModal
        isOpen={isDeleteModalOpen}
        user={userToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminUsers;

