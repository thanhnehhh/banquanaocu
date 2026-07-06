import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { User } from "@/services/adminUserService";

interface AdminUsersEditModalProps {
  isOpen: boolean;
  isSaving: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userData: Omit<User, "maNguoiDung" | "avatar">) => void;
}

const AdminUsersEditModal = ({
  isOpen,
  isSaving,
  user,
  onClose,
  onSave,
}: AdminUsersEditModalProps) => {
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

  // Sync with user prop when it changes
  useEffect(() => {
    if (user) {
      // Map gender char back to UI option
      const mappedGender =
        user.gioiTinh === "M"
          ? "Nam"
          : user.gioiTinh === "F"
          ? "Nữ"
          : "Khác";

      setFormData({
        email: user.email || "",
        hoDem: user.hoDem || "",
        ten: user.ten || "",
        diaChi: user.diaChi || "",
        gioiTinh: mappedGender,
        ngaySinh: user.ngaySinh || "",
        trangThai: user.trangThai ?? 1,
        role: user.roles?.[0] || "ROLE_USER",
      });
      setErrors({});
    }
  }, [user]);

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
      onSave({
        email: formData.email,
        hoDem: formData.hoDem,
        ten: formData.ten,
        diaChi: formData.diaChi,
        gioiTinh: formData.gioiTinh,
        ngaySinh: formData.ngaySinh,
        trangThai: formData.trangThai,
        roles: [formData.role],
      });
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-brand-heading">Chỉnh sửa tài khoản</h3>
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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Trạng thái
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="trangThai"
                  value="1"
                  checked={Number(formData.trangThai) === 1}
                  onChange={() => setFormData(prev => ({ ...prev, trangThai: 1 }))}
                  className="accent-green-600"
                  disabled={isSaving}
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="trangThai"
                  value="0"
                  checked={Number(formData.trangThai) === 0}
                  onChange={() => setFormData(prev => ({ ...prev, trangThai: 0 }))}
                  className="accent-red-600"
                  disabled={isSaving}
                />
                <span className="text-sm font-medium text-gray-700">
                  Inactive
                </span>
              </label>
            </div>
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
              className="flex-1 px-4 py-2 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersEditModal;
