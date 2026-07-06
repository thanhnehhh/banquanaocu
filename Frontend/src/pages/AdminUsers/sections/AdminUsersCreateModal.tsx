import { useState } from "react";
import { X } from "lucide-react";
import type { User } from "@/services/adminUserService";

interface AdminUsersCreateModalProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onCreate: (userData: Omit<User, "maNguoiDung" | "avatar">) => void;
}

const AdminUsersCreateModal = ({
  isOpen,
  isCreating,
  onClose,
  onCreate,
}: AdminUsersCreateModalProps) => {
  const [formData, setFormData] = useState<{
    email: string;
    hoDem: string;
    ten: string;
    diaChi: string;
    gioiTinh: string;
    ngaySinh: string;
    trangThai: number;
    role: string;
  }>({
    email: "",
    hoDem: "",
    ten: "",
    diaChi: "",
    gioiTinh: "Nam",
    ngaySinh: "",
    trangThai: 1,
    role: "ROLE_USER",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.ten) {
      newErrors.ten = "Tên không được bỏ trống";
    }

    if (!formData.role) {
      newErrors.role = "Quyền hạn không được bỏ trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreate({
        email: formData.email,
        hoDem: formData.hoDem,
        ten: formData.ten,
        diaChi: formData.diaChi,
        gioiTinh: formData.gioiTinh,
        ngaySinh: formData.ngaySinh,
        trangThai: formData.trangThai,
        roles: [formData.role],
      });
      setFormData({
        email: "",
        hoDem: "",
        ten: "",
        diaChi: "",
        gioiTinh: "Nam",
        ngaySinh: "",
        trangThai: 1,
        role: "ROLE_USER",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-brand-heading">Tạo tài khoản mới</h3>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
              disabled={isCreating}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Họ đệm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ đệm
            </label>
            <input
              type="text"
              name="hoDem"
              value={formData.hoDem}
              onChange={handleChange}
              placeholder="Họ đệm"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCreating}
            />
          </div>

          {/* Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ten"
              value={formData.ten}
              onChange={handleChange}
              placeholder="Tên"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ten ? "border-red-500" : "border-gray-300"
                }`}
              disabled={isCreating}
            />
            {errors.ten && (
              <p className="text-red-500 text-xs mt-1">{errors.ten}</p>
            )}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
              placeholder="Địa chỉ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCreating}
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            <select
              name="gioiTinh"
              value={formData.gioiTinh}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCreating}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              name="ngaySinh"
              value={formData.ngaySinh}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCreating}
            />
          </div>

          {/* Quyền hạn */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Quyền hạn <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="ROLE_USER"
                  checked={formData.role === "ROLE_USER"}
                  onChange={() => setFormData(prev => ({ ...prev, role: "ROLE_USER" }))}
                  className="accent-blue-600"
                  disabled={isCreating}
                />
                <span className="text-sm font-medium text-gray-700">
                  USER
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="ROLE_ADMIN"
                  checked={formData.role === "ROLE_ADMIN"}
                  onChange={() => setFormData(prev => ({ ...prev, role: "ROLE_ADMIN" }))}
                  className="accent-blue-600"
                  disabled={isCreating}
                />
                <span className="text-sm font-medium text-gray-700">
                  ADMIN
                </span>
              </label>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-4 py-2 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Đang tạo..." : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersCreateModal;
