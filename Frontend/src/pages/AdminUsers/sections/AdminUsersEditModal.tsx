import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { User } from "@/services/adminUserService";

interface Props {
  isOpen: boolean;
  isSaving: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userData: Omit<User, "maNguoiDung" | "avatar">) => void;
}

const AdminUsersEditModal = ({ isOpen, isSaving, user, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState({
    email: "", hoDem: "", ten: "", diaChi: "",
    gioiTinh: "Nam", ngaySinh: "", trangThai: 1, role: "ROLE_USER",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const mappedGender = user.gioiTinh === "M" ? "Nam" : user.gioiTinh === "F" ? "Nữ" : "Khác";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.email) errs.email = "Email không được bỏ trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Email không hợp lệ";
    if (!formData.ten) errs.ten = "Tên không được bỏ trống";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const mappedGender = formData.gioiTinh === "Nam" ? "M" : formData.gioiTinh === "Nữ" ? "F" : "O";
    onSave({ ...formData, gioiTinh: mappedGender, roles: [formData.role] });
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-brand-heading">Chỉnh sửa tài khoản</h3>
          <button onClick={onClose} disabled={isSaving} className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: "Email *", name: "email", type: "email", placeholder: "example@email.com" },
            { label: "Họ đệm", name: "hoDem", type: "text", placeholder: "Họ đệm" },
            { label: "Tên *", name: "ten", type: "text", placeholder: "Tên" },
            { label: "Địa chỉ", name: "diaChi", type: "text", placeholder: "Địa chỉ" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input type={type} name={name} value={(formData as any)[name]} onChange={handleChange} placeholder={placeholder} disabled={isSaving}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"}`} />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
            <select name="gioiTinh" value={formData.gioiTinh} onChange={handleChange} disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
            <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Quyền hạn *</label>
            <div className="flex gap-3">
              {["ROLE_USER", "ROLE_ADMIN"].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input type="radio" name="role" value={r} checked={formData.role === r}
                    onChange={() => setFormData(p => ({ ...p, role: r }))} className="accent-blue-600" disabled={isSaving} />
                  <span className="text-sm font-medium text-gray-700">{r.replace("ROLE_", "")}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Trạng thái</label>
            <div className="flex gap-3">
              {[{ val: 1, label: "Active" }, { val: 0, label: "Inactive" }].map(({ val, label }) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input type="radio" name="trangThai" value={val} checked={Number(formData.trangThai) === val}
                    onChange={() => setFormData(p => ({ ...p, trangThai: val }))}
                    className={val === 1 ? "accent-green-600" : "accent-red-600"} disabled={isSaving} />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
            <button type="submit" disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersEditModal;
