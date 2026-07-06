const AdminReviews = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pt-4 pb-12">

            <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Quản lý đánh giá</span>
            </div>

            {/* Thống kê & Bộ Lọc */}
            <div className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 border border-[#CDE5BC]">
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-bold text-[#49613E]">4,2/5</span>
                    <div className="flex text-yellow-400 text-lg mt-1">
                        ★★★★<span className="text-gray-300">★</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 flex-1">
                    <button className="px-5 py-2 bg-[#49613E] text-white text-sm font-bold rounded-full shadow-sm">Tất cả</button>
                    <button className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 border border-gray-200 shadow-sm">5 sao (100)</button>
                    <button className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 border border-gray-200 shadow-sm">4 sao (15)</button>
                    <button className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 border border-gray-200 shadow-sm">1-3 sao (5)</button>
                    <button className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 border border-gray-200 shadow-sm">Cần phản hồi (3)</button>
                </div>
            </div>

            {/* Thẻ Đánh giá (Review Card) */}
            <div className="bg-[#EBF5E4] rounded-2xl p-6 border border-[#CDE5BC]">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-[#1A1C19]">Lê Phương Chi</h3>
                        <p className="text-sm text-gray-500">Phân loại: Áo khoác Blazer - 12/03/2026</p>
                    </div>
                    <div className="flex text-yellow-400">★★★★★</div>
                </div>

                <p className="text-gray-800 text-sm mt-3 mb-6">
                    Áo đẹp lắm shop, form chuẩn như hình. Đóng gói rất cẩn thận và thơm. Lần sau sẽ ủng hộ shop tiếp nhé!
                </p>

                {/* Box phản hồi của Admin */}
                <div className="bg-[#D3E1C8] rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <span className="text-sm font-bold text-[#49613E] whitespace-nowrap">Phản hồi của bạn:</span>
                        <input
                            type="text"
                            placeholder="Nhập câu trả lời..."
                            className="flex-1 bg-white border border-transparent focus:border-[#49613E] rounded-full px-4 py-2.5 text-sm outline-none"
                        />
                    </div>
                    <div className="flex justify-end mt-1">
                        <button className="bg-[#51604B] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#3d4938] transition-colors shadow-sm">
                            Gửi phản hồi
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminReviews;