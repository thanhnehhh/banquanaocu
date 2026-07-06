import { Link } from "react-router-dom";

const AdminPromotions = () => {
    // Danh sách 4 nút menu
    const promotionMenus = [
        { title: "Quản lý mã Voucher", path: "/admin/promotions/vouchers" },
        { title: "Chương trình khuyến mãi", path: "/admin/promotions/campaigns" },
        { title: "Lịch sử sử dụng", path: "/admin/promotions/history" },
        { title: "Báo cáo hiệu quả", path: "/admin/promotions/reports" },
    ];

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pt-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Quản lý khuyến mãi</span>
            </div>

            {/* 4 Nút Menu Lớn */}
            <div className="flex flex-col gap-6 mt-8">
                {promotionMenus.map((menu, index) => (
                    <Link
                        key={index}
                        to={menu.path}
                        className="bg-[#EBF5E4] py-6 px-8 rounded-2xl border border-[#CDE5BC] text-center hover:bg-[#CDE5BC] transition-colors shadow-sm"
                    >
                        <h3 className="text-2xl font-bold text-[#49613E]">{menu.title}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminPromotions;