import { Trash2, Pencil, RotateCcw } from "lucide-react";
import type { User } from "@/services/adminUserService";

interface AdminUsersTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRestore: (user: User) => void;
}

const AdminUsersTable = ({
  users,
  loading,
  onEdit,
  onDelete,
  onRestore,
}: AdminUsersTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden mx-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="py-5 px-6 text-sm font-medium text-gray-500">
              Mã người dùng
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500">
              Tên
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500">
              Email
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">
              Quyền
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">
              Trạng thái
            </th>
            <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">
              Điều chỉnh
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.maNguoiDung}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  user.trangThai === 0 ? "opacity-60 bg-gray-100" : ""
                }`}
              >
                <td className="py-6 px-6 text-sm font-bold text-brand-heading">
                  {user.maNguoiDung}
                </td>
                <td className="py-6 px-6 text-sm text-gray-700">
                  {user.hoDem} {user.ten}
                </td>
                <td className="py-6 px-6 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="py-6 px-6 text-sm text-center">
                  {user.roles && user.roles.length > 0 ? (
                    (() => {
                      const cleanRole = user.roles[0].replace("ROLE_", "");
                      const isMainAdmin = cleanRole === "ADMIN";
                      return (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                            isMainAdmin
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {cleanRole}
                        </span>
                      );
                    })()
                  ) : (
                    <span className="text-gray-400 text-xs italic">Không có</span>
                  )}
                </td>
                <td className="py-6 px-6 text-sm text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.trangThai === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {user.trangThai === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-6 px-6 text-sm text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={18} />
                    </button>

                    {user.trangThai === 0 ? (
                      <button
                        onClick={() => onRestore(user)}
                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                        title="Khôi phục"
                      >
                        <RotateCcw size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onDelete(user)}
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
              <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
                Không tìm thấy người dùng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
