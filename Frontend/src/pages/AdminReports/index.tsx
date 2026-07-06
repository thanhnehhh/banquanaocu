import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminThongKe, type AdminThongKe } from '@/services/thongKeService';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminReports = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState<AdminThongKe | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async (selectedYear: number) => {
        setLoading(true);
        setError(null);
        try {
            const stats = await getAdminThongKe(selectedYear);
            setData(stats);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu thống kê:", err);
            setError("Không thể tải thông tin thống kê hệ thống.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(year);
    }, [year]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    // Chuẩn bị dữ liệu cho biểu đồ Doanh thu theo tháng (đảm bảo hiển thị đủ 12 tháng)
    const monthlyRevenueData = MONTH_NAMES.map((name, index) => {
        const monthNum = index + 1;
        const monthData = data?.doanhThuTheoThang?.find(item => item.thang === monthNum);
        return {
            name,
            value: monthData ? monthData.doanhThu : 0
        };
    });

    // Chuẩn bị dữ liệu cho biểu đồ Doanh thu theo danh mục
    const productRevenueData = (data?.doanhThuTheoDanhMuc || []).map(item => ({
        name: item.tenDanhMuc || 'Khác',
        value: item.doanhThu || 0
    }));

    if (loading && !data) {
        return (
            <div className="flex justify-center items-center min-h-[400px] text-gray-500">
                Đang tải dữ liệu thống kê...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12 px-4">

            {/* 1. Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500">Kênh ADMIN</span>
                    <span className="text-gray-400 font-bold">›</span>
                    <span className="font-bold text-[#1A1C19]">Thống kê báo cáo</span>
                </div>
                
                {/* Bộ lọc năm */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Năm báo cáo:</span>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="bg-white border border-gray-300 rounded-xl px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E6A4E] shadow-sm text-gray-700"
                    >
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                        <option value={2027}>2027</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* 2. Các thẻ chỉ số tổng quát (Summary Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col gap-2 shadow-sm border border-[#D1E7C4]">
                    <span className="text-gray-700 font-semibold text-base">Tổng Doanh thu</span>
                    <span className="text-2xl lg:text-3xl font-extrabold text-[#49613E] truncate">
                        {formatCurrency(data?.tongDoanhThu || 0)}
                    </span>
                </div>
                <div className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col gap-2 shadow-sm border border-[#D1E7C4]">
                    <span className="text-gray-700 font-semibold text-base">Tổng Đơn hàng</span>
                    <span className="text-3xl lg:text-4xl font-extrabold text-[#49613E]">
                        {(data?.tongDonHang || 0).toLocaleString()}
                    </span>
                </div>
                <div className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col gap-2 shadow-sm border border-[#D1E7C4]">
                    <span className="text-gray-700 font-semibold text-base">Khách hàng</span>
                    <span className="text-3xl lg:text-4xl font-extrabold text-[#49613E]">
                        {(data?.tongKhachHang || 0).toLocaleString()}
                    </span>
                </div>
                <div className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col gap-2 shadow-sm border border-[#D1E7C4]">
                    <span className="text-gray-700 font-semibold text-base">Cửa hàng</span>
                    <span className="text-3xl lg:text-4xl font-extrabold text-[#49613E]">
                        {(data?.tongCuaHang || 0).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* 3. Biểu đồ 1: Doanh thu theo tháng */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#1A1C19]">Biểu đồ doanh thu theo tháng ({year})</h3>
                <div className="bg-[#EBF5E4] rounded-2xl p-6 w-full h-[400px] shadow-sm border border-[#D1E7C4]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C4D7B5" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 12 }}
                                dx={-10}
                                tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toLocaleString()}M` : val.toLocaleString()}
                            />
                            <Tooltip
                                formatter={(val: number) => [formatCurrency(val), 'Doanh thu']}
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#98B880"
                                strokeWidth={3}
                                dot={{ fill: '#EBF5E4', stroke: '#98B880', strokeWidth: 3, r: 5 }}
                                activeDot={{ r: 8, fill: '#49613E', stroke: 'white' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Biểu đồ 2: Doanh thu theo sản phẩm / danh mục */}
            <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-xl font-bold text-[#1A1C19]">Biểu đồ doanh thu theo danh mục ({year})</h3>
                <div className="bg-[#EBF5E4] rounded-2xl p-6 w-full h-[400px] shadow-sm border border-[#D1E7C4]">
                    {productRevenueData.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-gray-500">
                            Không có dữ liệu cho năm này.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={productRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C4D7B5" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    dx={-10}
                                    tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toLocaleString()}M` : val.toLocaleString()}
                                />
                                <Tooltip
                                    formatter={(val: number) => [formatCurrency(val), 'Doanh thu']}
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#98B880"
                                    strokeWidth={3}
                                    dot={{ fill: '#EBF5E4', stroke: '#98B880', strokeWidth: 3, r: 5 }}
                                    activeDot={{ r: 8, fill: '#49613E', stroke: 'white' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdminReports;