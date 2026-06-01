import { useState } from "react";

// --- DỮ LIỆU GIẢ LẬP CHO TỪNG TAB ---
const mockNewProducts = Array(3).fill({
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=300&auto=format&fit=crop",
    name: "Jeans Vintage Levi's 501",
    category: "Quần cũ",
    owner: "Phạm Xuân Hải",
    price: "79.000 VNĐ",
    date: "12/3/2026"
});

const mockAds = Array(3).fill({
    author: "Phạm Xuân Hải",
    text: "Sản phẩm mới sử dụng 1 lần bao đổi trả....",
    media: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=300&auto=format&fit=crop",
    keywords: "SĐT, link,...",
    status: "Chờ duyệt"
});

const mockBanners = Array(3).fill({
    position: "Slider trang chủ",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=300&auto=format&fit=crop",
    link: "Link đến sản phẩm http://...",
    duration: "02/2/2026 - 02/5/2026",
    status: "Chờ duyệt"
});

const mockEvents = Array(3).fill({
    name: "Trao đổi hàng hóa",
    description: "Trao đổi các sản phẩm mới sử dụng 1 lần",
    location: "Nhà văn hóa....",
    status: "Chờ duyệt"
});

// --- COMPONENT CHÍNH ---
const AdminContent = () => {
    // State lưu trữ tab đang được chọn (Mặc định là tab đầu tiên)
    const [activeTab, setActiveTab] = useState("Sản phẩm mới");
    const tabs = ["Sản phẩm mới", "Bài quảng cáo", "Banner", "Sự kiện"];

    // Component hiển thị cột hành động (Xác nhận / Từ chối)
    const ActionButtons = () => (
        <div className="flex items-center justify-center gap-4">
            <button className="text-gray-600 hover:text-green-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button className="text-gray-600 hover:text-red-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">

            {/* 1. Breadcrumb */}
            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Duyệt nội dung</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex flex-col">

                {/* 2. Thanh Tabs */}
                <div className="flex justify-center gap-12 border-b border-gray-100 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 text-base font-medium transition-colors relative
                                ${activeTab === tab ? "text-[#1A1C19] font-bold" : "text-gray-500 hover:text-gray-700"}
                            `}
                        >
                            {tab}
                            {/* Đường gạch dưới cho tab đang active */}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1C19]"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* 3. Khu vực Bảng (Thay đổi dựa theo activeTab) */}
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">

                        {/* --- TAB 1: SẢN PHẨM MỚI --- */}
                        {activeTab === "Sản phẩm mới" && (
                            <>
                                <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Ảnh sản phẩm</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Tên Sản Phẩm</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Danh mục</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Chủ shop</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Giá bán</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Ngày Đăng</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Xác nhận</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mockNewProducts.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50">
                                        <td className="py-4 px-4"><img src={item.image} alt="product" className="w-20 h-14 object-cover mx-auto rounded shadow-sm"/></td>
                                        <td className="py-4 px-4 text-sm font-bold text-center">{item.name}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.category}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.owner}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.price}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.date}</td>
                                        <td className="py-4 px-4"><ActionButtons /></td>
                                    </tr>
                                ))}
                                </tbody>
                            </>
                        )}

                        {/* --- TAB 2: BÀI QUẢNG CÁO --- */}
                        {activeTab === "Bài quảng cáo" && (
                            <>
                                <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Người đăng</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Nội dung text</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Media</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Từ khóa vi phạm</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Trạng thái</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Xác nhận</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mockAds.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50">
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.author}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 max-w-[200px] truncate">{item.text}</td>
                                        <td className="py-4 px-4"><img src={item.media} alt="media" className="w-20 h-14 object-cover mx-auto rounded shadow-sm"/></td>
                                        <td className="py-4 px-4 text-sm font-bold text-[#1A1C19] text-center">{item.keywords}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.status}</td>
                                        <td className="py-4 px-4"><ActionButtons /></td>
                                    </tr>
                                ))}
                                </tbody>
                            </>
                        )}

                        {/* --- TAB 3: BANNER --- */}
                        {activeTab === "Banner" && (
                            <>
                                <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Vị trí hiển thị</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Hình ảnh</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Liên kết</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Thời hạn hiển thị</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Trạng thái</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Xác nhận</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mockBanners.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50">
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.position}</td>
                                        <td className="py-4 px-4"><img src={item.image} alt="banner" className="w-20 h-14 object-cover mx-auto rounded shadow-sm"/></td>
                                        <td className="py-4 px-4 text-sm text-gray-500 max-w-[150px] truncate">{item.link}</td>
                                        <td className="py-4 px-4 text-sm font-bold text-[#1A1C19] text-center whitespace-pre-line">{item.duration.replace(" - ", "\n")}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.status}</td>
                                        <td className="py-4 px-4"><ActionButtons /></td>
                                    </tr>
                                ))}
                                </tbody>
                            </>
                        )}

                        {/* --- TAB 4: SỰ KIỆN --- */}
                        {activeTab === "Sự kiện" && (
                            <>
                                <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Tên sự kiện</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Mô tả</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Địa điểm/Hình thức</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Trạng thái</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 text-center">Xác nhận</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mockEvents.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50">
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.name}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center max-w-[200px]">{item.description}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.location}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-center">{item.status}</td>
                                        <td className="py-4 px-4"><ActionButtons /></td>
                                    </tr>
                                ))}
                                </tbody>
                            </>
                        )}

                    </table>
                </div>

                {/* 4. Phân trang (Nằm gọn trong ô trắng) */}
                <div className="flex justify-center items-center gap-4 mt-8 pt-8 border-t border-gray-50">
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

export default AdminContent;