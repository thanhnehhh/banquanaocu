import { useState } from "react";

// --- DỮ LIỆU GIẢ LẬP THEO ĐÚNG FIGMA ---
const mockOrderComplaints = Array(4).fill({
    complaintId: "KN-12345",
    orderId: "123232",
    customer: "Nguyễn Văn A",
    reason: "Áo bị rách",
    proof: "aorach.png",
    date: "03/04/2026",
    status: "Đang chờ xử lí"
});

// Chú ý: Dữ liệu này tôi gõ y hệt text trong thiết kế Figma của bạn
const mockSellerWarnings = Array(4).fill({
    shopName: "KN-12345",
    orderId: "123232",
    violationType: "Nguyễn Văn A",
    severity: "Áo bị rách",
    penalty: "aorach.png",
    statusDate: "03/04/2026"
});

const AdminComplaints = () => {
    const [activeTab, setActiveTab] = useState("Khiếu nại đơn hàng");

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">

            {/* 1. Breadcrumb */}
            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Quản lý khiếu nại</span>
            </div>

            {/* 2. Khung nội dung chính */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex flex-col relative">

                {/* Thanh Tabs & Nút Tạo cảnh cáo (Chỉ hiện ở Tab 2) */}
                <div className="flex justify-center gap-16 mb-8 relative">
                    {["Khiếu nại đơn hàng", "Cảnh cáo người bán"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 text-lg font-medium transition-colors relative
                                ${activeTab === tab ? "text-[#1A1C19] font-bold" : "text-gray-500 hover:text-gray-700"}
                            `}
                        >
                            {tab}
                        </button>
                    ))}

                    {/* Nút Tạo cảnh cáo góc phải */}
                    {activeTab === "Cảnh cáo người bán" && (
                        <button className="absolute right-0 top-0 px-6 py-2 bg-[#51604B] text-white rounded-full font-bold text-sm hover:bg-[#3d4938] transition-colors shadow-sm">
                            Tạo cảnh cáo
                        </button>
                    )}
                </div>

                {/* 3. Bảng Dữ Liệu */}
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-4">

                        {/* --- TAB 1: KHIẾU NẠI ĐƠN HÀNG --- */}
                        {activeTab === "Khiếu nại đơn hàng" && (
                            <>
                                <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Mã khiếu nại</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">ID đơn hàng</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Khách hàng</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Lý do</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Bằng chứng</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Ngày gửi</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Trạng thái</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mockOrderComplaints.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.complaintId}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.orderId}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.customer}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.reason}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.proof}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.date}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.status}</td>
                                        <td className="py-6 px-4 text-sm text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                {/* Icon Xem (Eye) */}
                                                <button className="text-gray-800 hover:text-[#49613E]"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button>
                                                {/* Icon Chat */}
                                                <button className="text-gray-800 hover:text-[#49613E]"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </>
                        )}

                        {/* --- TAB 2: CẢNH CÁO NGƯỜI BÁN --- */}
                        {activeTab === "Cảnh cáo người bán" && (
                            <>
                                <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Tên Shop</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">ID đơn hàng</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Loại vi phạm</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Mức độ</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Hình thức phạt</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Trạng thái xác nhận</th>
                                    <th className="py-4 px-4 text-xs font-bold text-[#1A1C19] text-center">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mockSellerWarnings.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.shopName}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.orderId}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.violationType}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.severity}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.penalty}</td>
                                        <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.statusDate}</td>
                                        <td className="py-6 px-4 text-sm text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                {/* Icon Tích (Check) */}
                                                <button className="text-gray-800 hover:text-green-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></button>
                                                {/* Icon Sửa (Edit) */}
                                                <button className="text-gray-800 hover:text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                                                {/* Icon Xóa (Trash) */}
                                                <button className="text-gray-800 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </>
                        )}
                    </table>
                </div>

                {/* 4. Phân trang */}
                <div className="flex justify-center items-center gap-4 mt-8 pt-4">
                    <button className="px-6 py-2 bg-[#51604B] text-white font-medium rounded-full hover:bg-[#3d4938] transition-colors shadow-sm text-sm">
                        First Page
                    </button>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium transition-colors
                                    ${page === 1 ? "border-[#49613E] text-[#49613E] font-bold" : "border-[#1A1C19] text-[#1A1C19] hover:bg-gray-100"}
                                `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button className="px-6 py-2 bg-[#51604B] text-white font-medium rounded-full hover:bg-[#3d4938] transition-colors shadow-sm text-sm">
                        Last Page
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminComplaints;