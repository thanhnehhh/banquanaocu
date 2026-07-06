import { useState } from "react";

const mockShipping = [
    { id: "VC001", customer: "Quý", code: "012345988", rawPrice: "áihglashkfiK...", discount: "Nhanh", finalPrice: "30000", date: "03/04/2026", status: "Chờ xử lý" },
    { id: "VC002", customer: "ABC", code: "035698945", rawPrice: "SLJF;ALSVM...", discount: "Thường", finalPrice: "36363", date: "11/05/2026", status: "Đang giao" },
    { id: "VC003", customer: "XYZ", code: "031647997", rawPrice: "A;LCM;ALSK...", discount: "Nhanh", finalPrice: "8386", date: "04/07/2026", status: "Đã giao" },
    { id: "VC004", customer: "MNO", code: "03165646", rawPrice: "ALLVMA;LSFJ", discount: "Thường", finalPrice: "52000", date: "23/10/2026", status: "Thất bại" },
];

const AdminShipping = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">
            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Quản lý vận chuyển</span>
            </div>

            <div className="flex justify-between items-center px-2">
                <div className="relative w-[400px]">
                    <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-6 pr-12 py-3 bg-[#F3F4F1] border border-gray-200 rounded-lg focus:outline-none focus:border-[#49613E]" />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase">Sắp xếp:</span>
                    <select className="px-4 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none cursor-pointer text-sm font-medium"><option>MỚI NHẤT</option></select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAF4]">
                    <tr className="border-b border-gray-100">
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">ID Đơn hàng</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Khách hàng</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Mã ưu đãi</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Tổng nguyên giá</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Số tiền giảm</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Thực thu</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Thời gian đặt</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Trạng thái đơn</th>
                        <th className="py-5 px-4 text-xs font-bold text-[#1A1C19] text-center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mockShipping.map((item, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">{item.id}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 text-center">{item.customer}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 text-center">{item.code}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 text-center max-w-[100px] truncate">{item.rawPrice}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">{item.discount}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 text-center">{item.finalPrice}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 text-center">{item.date}</td>
                            <td className={`py-4 px-4 text-sm font-bold text-center
                                    ${item.status === 'Chờ xử lý' ? 'text-orange-400' : ''}
                                    ${item.status === 'Đang giao' ? 'text-blue-500' : ''}
                                    ${item.status === 'Đã giao' ? 'text-green-600' : ''}
                                    ${item.status === 'Thất bại' ? 'text-red-500' : ''}
                                `}>{item.status}</td>
                            <td className="py-4 px-4 text-center">
                                <div className="flex justify-center gap-2">
                                    <button className="text-gray-600 hover:text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                                    <button className="text-gray-600 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center gap-4 mt-4">
                <button className="px-6 py-2 bg-[#51604B] text-white font-medium rounded-full hover:bg-[#3d4938] text-sm">First Page</button>
                <div className="flex gap-2">{[1, 2, 3, 4, 5].map((page) => (<button key={page} className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium ${page === 1 ? "border-[#49613E] text-[#49613E] font-bold" : "border-[#1A1C19] text-[#1A1C19]"}`}>{page}</button>))}</div>
                <button className="px-6 py-2 bg-[#51604B] text-white font-medium rounded-full hover:bg-[#3d4938] text-sm">Last Page</button>
            </div>
        </div>
    );
};

export default AdminShipping;