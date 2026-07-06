import { useState } from "react";
import { Link } from "react-router-dom";

const mockVouchers = [
    { code: "ABC", discount: "12", quantity: "100", used: "45", duration: "03/03/2026-\n03/04/2026", status: "hết hạn" },
    { code: "HDK", discount: "20", quantity: "200", used: "120", duration: "03/03/2026-\n03/06/2026", status: "đang dùng" },
    { code: "ILSKFH", discount: "6", quantity: "50", used: "23", duration: "03/03/2026-\n03/06/2026", status: "đang dùng" },
];

const AdminVouchers = () => {
    // State để điều khiển việc đóng/mở Popup
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12 relative">

            {/* Breadcrumb có nút Back ngầm qua Link */}
            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <Link to="/admin/promotions" className="text-gray-500 hover:text-[#49613E] transition-colors">Quản lý khuyến mãi</Link>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Quản lý mã Voucher</span>
            </div>

            {/* Thanh công cụ: Search + Sort + Button Create */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-[400px]">
                    <input type="text" placeholder="Tìm kiếm..." className="w-full pl-6 pr-12 py-2 bg-[#F3F4F1] border border-gray-200 rounded-lg focus:outline-none focus:border-[#49613E]" />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase">Sắp xếp:</span>
                        <select className="px-4 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:border-[#49613E] cursor-pointer text-sm font-medium"><option>MỚI NHẤT</option></select>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)} // Mở Popup
                        className="px-8 py-2 bg-[#1A1C19] text-white rounded-lg font-bold hover:bg-black transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu Voucher */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAF4]">
                    <tr className="border-b border-gray-200">
                        <th className="py-4 px-6 text-xs font-bold text-[#1A1C19]">Mã Voucher</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1A1C19]">Giảm giá (%)</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1A1C19]">Số lượng</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1A1C19]">Đã sử dụng</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1A1C19]">Thời hạn</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1A1C19]">Trạng thái</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1A1C19] text-center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mockVouchers.map((item, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-800">{item.code}</td>
                            <td className="py-4 px-6 text-sm text-gray-800">{item.discount}</td>
                            <td className="py-4 px-6 text-sm text-gray-800">{item.quantity}</td>
                            <td className="py-4 px-6 text-sm text-gray-800">{item.used}</td>
                            <td className="py-4 px-6 text-sm text-gray-800 whitespace-pre-line leading-tight">{item.duration}</td>
                            <td className={`py-4 px-6 text-sm font-bold ${item.status === 'hết hạn' ? 'text-red-500' : 'text-green-500'}`}>{item.status}</td>
                            <td className="py-4 px-6 text-sm text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <button className="text-gray-800 hover:text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                                    <button className="text-gray-800 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL TẠO VOUCHER --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    {/* Hộp thoại Modal */}
                    <div className="bg-white w-[480px] rounded-3xl p-8 relative shadow-2xl animate-fade-in-up">
                        {/* Nút X để đóng */}
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h2 className="text-3xl font-bold text-center text-[#1A1C19] mb-8">Voucher</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã voucher</label>
                                <input type="text" placeholder="ABC123" className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#49613E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
                                <input type="text" placeholder="5, 10, 15,..." className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#49613E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị đơn tối thiểu</label>
                                <input type="text" placeholder="200000" className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#49613E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                <input type="text" placeholder="100, 200,..." className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#49613E]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                                    <input type="text" placeholder="1/4/2026" className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#49613E]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Kết thúc</label>
                                    <input type="text" placeholder="7/4/2026" className="w-full bg-[#F9FAF4] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#49613E]" />
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-[#51604B] text-white font-bold text-lg rounded-xl py-4 mt-4 hover:bg-[#3d4938] transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminVouchers;