import { X } from "lucide-react";
import type { User } from "@/services/adminUserService";

interface Props { isOpen: boolean; user: User | null; tempStatus: number; isSaving: boolean; onClose: () => void; onStatusChange: (s: number) => void; onSave: () => void; isHidden?: boolean; }

const AdminUsersDetailModal = ({ isOpen, user, tempStatus, isSaving, onClose, onStatusChange, onSave, isHidden }: Props) => {
  if (!isOpen || !user) return null;
  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString("vi-VN"); } catch { return d; } };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h3 className="text-xl font-bold text-brand-heading">Chi tiết người dùng</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex justify-center mb-4">
            <img src={user.avatar} alt={`${user.hoDem} ${user.ten}`} className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/80"; }} />
          </div>
          {[
            { label: "Mã người dùng", value: String(user.maNguoiDung) },
            { label: "Tên", value: `${user.hoDem} ${user.ten}` },
            { label: "Email", value: user.email },
            { label: "Địa chỉ", value: user.diaChi || "N/A" },
            { label: "Giới tính", value: user.gioiTinh || "N/A" },
            { label: "Ngày sinh", value: formatDate(user.ngaySinh) },
          ].map(({ label, value }) => (
            <div key={label}><label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label><p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{value}</p></div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Trạng thái</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input type="radio" name="status" checked={tempStatus === 1} onChange={() => onStatusChange(1)} className="accent-green-600" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input type="radio" name="status" checked={tempStatus === 0} onChange={() => onStatusChange(0)} className="accent-red-600" disabled={isHidden} />
                <span className={`text-sm font-medium ${isHidden ? "text-gray-400" : "text-gray-700"}`}>Inactive</span>
              </label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Hủy</button>
          <button onClick={onSave} disabled={isSaving} className="flex-1 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-[#3a4d31] disabled:bg-gray-400">{isSaving ? "Đang lưu..." : "Lưu"}</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersDetailModal;
