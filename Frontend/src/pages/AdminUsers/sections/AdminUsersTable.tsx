import { Eye, Trash2 } from "lucide-react";
import type { User } from "@/services/adminUserService";

interface Props { users: User[]; loading: boolean; onViewDetails: (user: User) => void; onDelete: (user: User) => void; }

const AdminUsersTable = ({ users, loading, onViewDetails, onDelete }: Props) => (
  <div className="bg-white rounded-xl shadow overflow-hidden mx-4">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="py-5 px-6 text-sm font-medium text-gray-500">Mã người dùng</th>
          <th className="py-5 px-6 text-sm font-medium text-gray-500">Tên</th>
          <th className="py-5 px-6 text-sm font-medium text-gray-500">Email</th>
          <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Trạng thái</th>
          <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Điều chỉnh</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={5} className="py-8 px-6 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
        ) : users.length > 0 ? users.map((user) => (
          <tr key={user.maNguoiDung} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${user.trangThai === 0 ? "opacity-60 bg-gray-100" : ""}`}>
            <td className="py-6 px-6 text-sm font-bold text-brand-heading">{user.maNguoiDung}</td>
            <td className="py-6 px-6 text-sm text-gray-700">{user.hoDem} {user.ten}</td>
            <td className="py-6 px-6 text-sm text-gray-600">{user.email}</td>
            <td className="py-6 px-6 text-sm text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.trangThai === 1 ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-700"}`}>
                {user.trangThai === 1 ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-6 px-6 text-sm text-center">
              <div className="flex justify-center gap-3">
                <button onClick={() => onViewDetails(user)} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Xem chi tiết"><Eye size={18} /></button>
                <button onClick={() => onDelete(user)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Xóa"><Trash2 size={18} /></button>
              </div>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="py-8 px-6 text-center text-gray-500">Không tìm thấy người dùng nào</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

export default AdminUsersTable;
