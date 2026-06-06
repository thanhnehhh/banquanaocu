import { useState } from "react";
import { Link } from "react-router-dom";

const mockVouchers = [
  { code: "ABC", discount: "12", quantity: "100", used: "45", duration: "03/03/2026-\n03/04/2026", status: "hết hạn" },
  { code: "HDK", discount: "20", quantity: "200", used: "120", duration: "03/03/2026-\n03/06/2026", status: "đang dùng" },
];

const AdminVouchers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12 relative">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500">Kênh ADMIN</span><span className="text-gray-400 font-bold">›</span>
        <Link to="/admin/promotions" className="text-gray-500 hover:text-[#49613E]">Quản lý khuyến mãi</Link><span className="text-gray-400 font-bold">›</span>
        <span className="font-bold text-[#1A1C19]">Quản lý mã Voucher</span>
      </div>
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <input type="text" placeholder="Tìm kiếm..." className="w-[300px] pl-4 pr-4 py-2 bg-[#F3F4F1] border border-gray-200 rounded-lg focus:outline-none" />
        <button onClick={() => setIsModalOpen(true)} className="px-8 py-2 bg-[#1A1C19] text-white rounded-lg font-bold hover:bg-black">Create</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F9FAF4]"><tr className="border-b border-gray-200">
            <th className="py-4 px-6 text-xs font-bold">Mã Voucher</th><th className="py-4 px-6 text-xs font-bold">Giảm giá (%)</th><th className="py-4 px-6 text-xs font-bold">Số lượng</th><th className="py-4 px-6 text-xs font-bold">Đã sử dụng</th><th className="py-4 px-6 text-xs font-bold">Thời hạn</th><th className="py-4 px-6 text-xs font-bold">Trạng thái</th>
          </tr></thead>
          <tbody>
            {mockVouchers.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 px-6 text-sm">{item.code}</td><td className="py-4 px-6 text-sm">{item.discount}</td><td className="py-4 px-6 text-sm">{item.quantity}</td><td className="py-4 px-6 text-sm">{item.used}</td>
                <td className="py-4 px-6 text-sm whitespace-pre-line leading-tight">{item.duration}</td>
                <td className={`py-4 px-6 text-sm font-bold ${item.status === 'hết hạn' ? 'text-red-500' : 'text-green-500'}`}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[480px] rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">✕</button>
            <h2 className="text-3xl font-bold text-center text-[#1A1C19] mb-8">Voucher</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Mã voucher" className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none" />
              <input type="text" placeholder="Giảm giá (%)" className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none" />
              <input type="text" placeholder="Số lượng" className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none" />
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-[#51604B] text-white font-bold text-lg rounded-xl py-4 hover:bg-[#3d4938]">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVouchers;
