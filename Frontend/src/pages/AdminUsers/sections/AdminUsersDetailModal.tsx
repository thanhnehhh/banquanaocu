import { X } from "lucide-react";
import type { User } from "@/services/adminUserService";

interface AdminUsersDetailModalProps {
  isOpen: boolean;
  user: User | null;
  tempStatus: number;
  isSaving: boolean;
  onClose: () => void;
  onStatusChange: (status: number) => void;
  onSave: () => void;
  isHidden?: boolean;
}

const AdminUsersDetailModal = ({
  isOpen,
  user,
  tempStatus,
  isSaving,
  onClose,
  onStatusChange,
  onSave,
  isHidden,
}: AdminUsersDetailModalProps) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h3 className="text-xl font-bold text-brand-heading">
            Chi tiết người dùng
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex justify-center mb-4">
            <img
              src={user.avatar} // <-- user.avatar sẽ chứa link Supabase
              alt={`${user.hoDem} ${user.ten}`}
              className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/80";
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Mã người dùng
            </label>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
              {user.maNguoiDung}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Tên
            </label>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
              {user.hoDem} {user.ten}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email
            </label>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
              {user.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Địa chỉ
            </label>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg wrap-break-word">
              {user.diaChi || "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Giới tính
            </label>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
              {user.gioiTinh || "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Ngày sinh
            </label>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
              {formatDate(user.ngaySinh)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Trạng thái
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="status"
                  value="1"
                  checked={tempStatus === 1}
                  onChange={() => onStatusChange(1)}
                  className="accent-green-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="status"
                  value="0"
                  checked={tempStatus === 0}
                  onChange={() => onStatusChange(0)}
                  className="accent-red-600"
                  disabled={isHidden}
                />
                <span
                  className={`text-sm font-medium ${isHidden ? "text-gray-400" : "text-gray-700"}`}
                >
                  Inactive
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-[#3a4d31] disabled:bg-gray-400 transition-colors"
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersDetailModal;
