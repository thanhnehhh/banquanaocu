import { useState } from "react";

// Dữ liệu giả lập (Mock data) theo đúng thiết kế Figma
const mockOrders = Array(5).fill({
    id: "121232323",
    customer: "Phạm Xuân Hải",
    pickup: "23/0.5 Phan Đăng Lưu\nQuận 2\nThành phố Hồ Chí Minh",
    delivery: "23/0.5 Phan Đăng Lưu\nQuận 2\nThành phố Hồ Chí Minh",
    shipper: "Phạm Anh Tài",
    status: "Đã giao"
});

const AdminOrders = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">

            {/* 1. Breadcrumb */}
            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Quản lý đơn hàng</span>
            </div>

            {/* 2. Thẻ chỉ số (Stats Cards) - Màu sắc theo Figma */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-gray-700 font-medium text-lg">Số lượng</span>
                    <span className="text-4xl font-bold text-[#49613E]">980M</span>
                </div>
                <div className="bg-[#CDE5BC] rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-gray-700 font-medium text-lg">Đang vận chuyển</span>
                    <span className="text-4xl font-bold text-[#49613E]">45M</span>
                </div>
                <div className="bg-[#A8C69F] rounded-2xl p-6 flex flex-col gap-2 text-white">
                    <span className="text-white/80 font-medium text-lg">Chờ xử lý</span>
                    <span className="text-4xl font-bold">425M</span>
                </div>
                <div className="bg-[#FDF2B3] rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-gray-700 font-medium text-lg">Đơn bị hoàn</span>
                    <span className="text-4xl font-bold text-[#49613E]">4512</span>
                </div>
            </div>

            {/* 3. Tiêu đề khu vực bảng */}
            <h2 className="text-2xl font-bold text-center text-[#1A1C19]">
                Lịch sử đơn hàng
            </h2>

            {/* 4. Thanh Tìm kiếm & Công cụ */}
            <div className="flex justify-between items-center px-2">
                <div className="relative w-[400px]">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-6 pr-12 py-3 bg-[#F3F4F1] border border-gray-200 rounded-lg focus:outline-none focus:border-[#49613E]"
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase">Sắp xếp:</span>
                        <select className="border border-gray-300 rounded-md py-2 px-4 text-sm font-medium focus:outline-none cursor-pointer">
                            <option>MỚI NHẤT</option>
                        </select>
                    </div>
                    {/* Nút In (Print) */}
                    <button className="px-8 py-2 bg-[#1A1C19] text-white rounded-lg font-bold hover:bg-black transition-colors">
                        In
                    </button>
                </div>
            </div>

            {/* 5. Bảng đơn hàng (Table) */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAF4]">
                    <tr className="border-b border-gray-100">
                        <th className="py-5 px-6 text-sm font-medium text-gray-500">ID đơn hàng</th>
                        <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Khách hàng</th>
                        <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Địa điểm lấy hàng</th>
                        <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Địa điểm giao hàng</th>
                        <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Người giao</th>
                        <th className="py-5 px-6 text-sm font-medium text-gray-500 text-center">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mockOrders.map((order, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-6 px-6 text-sm font-bold text-[#1A1C19]">{order.id}</td>
                            <td className="py-6 px-6 text-sm font-bold text-[#1A1C19] text-center">{order.customer}</td>
                            <td className="py-6 px-6 text-sm text-gray-500 text-center leading-relaxed">
                                <div className="whitespace-pre-line">{order.pickup}</div>
                            </td>
                            <td className="py-6 px-6 text-sm text-gray-500 text-center leading-relaxed">
                                <div className="whitespace-pre-line">{order.delivery}</div>
                            </td>
                            <td className="py-6 px-6 text-sm text-gray-800 font-medium text-center">{order.shipper}</td>
                            <td className="py-6 px-6 text-sm text-[#49613E] font-bold text-center">{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 6. Phân trang */}
            <div className="flex justify-center items-center gap-4 mt-4 pb-8">
                <button className="px-6 py-2 bg-[#51604B] text-white font-medium rounded-full hover:bg-[#3d4938]">
                    First Page
                </button>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((page) => (
                        <button
                            key={page}
                            className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium transition-colors
                                ${page === 1 ? "border-[#49613E] text-[#49613E] font-bold" : "border-[#1A1C19] text-[#1A1C19] hover:bg-gray-100"}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button className="px-6 py-2 bg-[#51604B] text-white font-medium rounded-full hover:bg-[#3d4938]">
                    Last Page
                </button>
            </div>

        </div>
    );
};

export default AdminOrders;