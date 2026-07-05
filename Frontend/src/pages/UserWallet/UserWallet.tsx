import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    getDoanhThuDanhMucTheoKhoangNgay,
    getDoanhThuTheoKhoangNgay,
    getThongTinVi,
    postRutTien,
    type DoanhThuDanhMuc
} from '@/services/thongKeService';

type Transaction = {
    id: number;
    date: string;
    detail: string;
    status: string;
    amount: string;
    type: "inflow" | "outflow";
};

const COLORS = ['#49613E', '#809B71', '#A6C496', '#CDE5C0', '#34D399'];

function UserWallet() {
    const user = useSelector((state: RootState) => state.auth.user);
    const maSeller = (user as any)?.maNguoiDung;

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Bộ lọc ngày cho biểu đồ
    const today = new Date();
    const firstDayOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    const todayStr = today.toISOString().split('T')[0];
    const [chartFromDate, setChartFromDate] = useState(firstDayOfMonth);
    const [chartToDate, setChartToDate] = useState(todayStr);
    const [chartFromInput, setChartFromInput] = useState(firstDayOfMonth);
    const [chartToInput, setChartToInput] = useState(todayStr);

    const [categoryData, setCategoryData] = useState<DoanhThuDanhMuc[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [dailyData, setDailyData] = useState<any[]>([]);
    const [loadingDaily, setLoadingDaily] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingWallet, setLoadingWallet] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [withdrawError, setWithdrawError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchWalletInfo = async () => {
        if (!maSeller) return;
        setLoadingWallet(true);
        try {
            const res = await getThongTinVi(maSeller);
            setBalance(res?.soDu ?? 0);
            if (res && res.lichSu) {
                const mappedList: Transaction[] = res.lichSu.map((item: any) => {
                    const dateObj = new Date(item.ngayTao);
                    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                    return {
                        id: item.id,
                        date: formattedDate,
                        detail: item.moTa,
                        status: item.trangThai,
                        amount: `${item.loaiGiaoDich === 'inflow' ? '+' : '-'} ${item.soTien.toLocaleString('vi-VN')}đ`,
                        type: item.loaiGiaoDich,
                    };
                });
                setTransactions(mappedList);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin ví:", error);
        } finally {
            setLoadingWallet(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!maSeller) return;
            setLoadingCategories(true);
            setLoadingDaily(true);
            try {
                const resCat = await getDoanhThuDanhMucTheoKhoangNgay(maSeller, chartFromDate, chartToDate);
                setCategoryData(resCat);

                const resDaily = await getDoanhThuTheoKhoangNgay(maSeller, chartFromDate, chartToDate);
                setDailyData(resDaily.map(item => ({ name: `Ngày ${item.ngay}`, doanhThu: item.doanhThu })));
            } catch (error) {
                console.error("Lỗi thống kê:", error);
            } finally {
                setLoadingCategories(false);
                setLoadingDaily(false);
            }
        };
        fetchData();
        fetchWalletInfo();
    }, [chartFromDate, chartToDate, maSeller]);

    const handleWithdraw = async () => {
        const amount = Number(withdrawAmount);
        if (!withdrawAmount || amount <= 0) { setWithdrawError("Vui lòng nhập số tiền hợp lệ."); return; }
        if (amount < 50000) { setWithdrawError("Số tiền rút tối thiểu là 50.000đ."); return; }
        if (amount > balance) { setWithdrawError("Số dư tài khoản không đủ."); return; }
        setIsSubmitting(true);
        try {
            await postRutTien(maSeller, amount);
            setIsWithdrawModalOpen(false);
            setWithdrawAmount("");
            setWithdrawError("");
            await fetchWalletInfo();
        } catch (error: any) {
            setWithdrawError(error?.response?.data || "Rút tiền thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalCategoryRevenue = useMemo(() => categoryData.reduce((sum, item) => sum + item.doanhThu, 0), [categoryData]);
    const tooltipFormatter = (value: number): [string, string] => [`${(typeof value === 'number' ? value : 0).toLocaleString('vi-VN')} đ`, "Doanh thu"];
    const filteredTransactions = useMemo(() => transactions.filter((t) => {
        const d = new Date(t.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
    }), [fromDate, toDate, transactions]);

    // Guard: chờ maSeller có giá trị
    if (!maSeller) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#49613E]"></div>
                <span className="font-bold text-sm text-slate-700">Đang tải thông tin tài khoản...</span>
            </div>
        );
    }

    return (
        <div className="py-16 px-12 relative">
            <div className="flex flex-col gap-3">
                <div className="text-sm text-slate-500">Trang chủ &gt; Tiền của tôi</div>
                <h1 className="text-3xl font-extrabold text-slate-900">Túi tiền của tôi</h1>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="rounded-3xl bg-[#ECF9E7] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-sm text-slate-600"><span>Số dư của bạn</span><span className="text-xl">💰</span></div>
                        <div className="mt-4 text-4xl font-extrabold text-slate-900">{loadingWallet ? "..." : `${(balance || 0).toLocaleString('vi-VN')}₫`}</div>
                        <div className="mt-2 text-sm text-emerald-700">↑ Tăng 15% so với tháng trước</div>
                    </div>
                    <button onClick={() => setIsWithdrawModalOpen(true)}
                        className="mt-6 w-full rounded-full bg-[#49613E] py-3 text-sm font-bold text-white transition hover:bg-[#384a2f] active:scale-95">
                        Rút tiền
                    </button>
                </div>
                <div className="rounded-3xl bg-[#ECF9E7] p-6 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-600"><span>Điểm</span><span className="text-xl">🎁</span></div>
                    <div className="mt-6 text-4xl font-extrabold text-slate-900">45</div>
                    <div className="mt-2 text-sm text-slate-600">Đã hoàn thành 40</div>
                </div>
                <div className="rounded-3xl bg-[#ECF9E7] p-6 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-600"><span>Lượt xem shop</span><span className="text-xl">👀</span></div>
                    <div className="mt-6 text-4xl font-extrabold text-slate-900">1,240</div>
                    <div className="mt-2 text-sm text-emerald-700">↑ Tăng 5%</div>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-12 gap-4 mt-8">
                {/* Biểu đồ cột */}
                <div className="col-span-8 rounded-[24px] bg-[#ECF9E7] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm text-slate-600">Biểu đồ doanh thu</div>
                            <div className="mt-2 text-xl font-semibold text-slate-900">Theo ngày</div>
                        </div>
                        {/* Bộ lọc ngày */}
                        <div className="flex items-end gap-2">
                            <label className="flex flex-col gap-1 text-xs text-slate-500">
                                Từ ngày
                                <input type="date" value={chartFromInput} onChange={(e) => setChartFromInput(e.target.value)}
                                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#49613E]" />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-slate-500">
                                Đến ngày
                                <input type="date" value={chartToInput} onChange={(e) => setChartToInput(e.target.value)}
                                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#49613E]" />
                            </label>
                            <button onClick={() => { setChartFromDate(chartFromInput); setChartToDate(chartToInput); }}
                                className="rounded-full bg-[#49613E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#384a2f] transition">
                                Xem
                            </button>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-white p-4 h-72">
                        {loadingDaily ? (
                            <div className="flex justify-center items-center h-full text-[#49613E] font-bold">Đang tải dữ liệu...</div>
                        ) : dailyData.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-400">Chưa có giao dịch trong khoảng thời gian này</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                    <YAxis tickFormatter={(v) => `${(v / 1000)}k`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                                    <Tooltip formatter={tooltipFormatter} cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="doanhThu" fill="#49613E" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Biểu đồ tròn */}
                <div className="col-span-4 rounded-3xl bg-[#ECF9E7] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm text-slate-600">Tỷ lệ danh mục</div>
                            <div className="mt-2 text-xl font-semibold text-slate-900">Phân bổ</div>
                        </div>
                        <span className="text-xs text-slate-400 text-right">{chartFromDate}<br />→ {chartToDate}</span>
                    </div>
                    <div className="rounded-3xl bg-white p-6">
                        {loadingCategories ? (
                            <div className="flex justify-center items-center h-40 text-[#49613E] font-bold">Đang tải...</div>
                        ) : categoryData.length === 0 ? (
                            <div className="flex justify-center items-center h-40 text-gray-400">Chưa có dữ liệu</div>
                        ) : (
                            <>
                                <div className="relative flex items-center justify-center mb-6 h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="doanhThu" nameKey="tenDanhMuc">
                                                {categoryData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={tooltipFormatter} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3 text-sm text-slate-700 max-h-32 overflow-y-auto pr-2">
                                    {categoryData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                                <span className="font-medium">{item.tenDanhMuc}</span>
                                            </div>
                                            <span className="font-bold">{((item.doanhThu / totalCategoryRevenue) * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Lịch sử giao dịch */}
            <div className="rounded-3xl bg-white p-6 shadow-sm mt-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="text-xl font-semibold text-slate-900">Giao dịch của bạn</div>
                        <div className="mt-1 text-sm text-slate-500">Hiển thị {filteredTransactions.length} giao dịch theo bộ lọc</div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="flex flex-col gap-2 text-sm text-slate-600">Từ ngày
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-primary" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-slate-600">Đến ngày
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-primary" />
                        </label>
                        <div className="flex items-end">
                            <button type="button" onClick={() => { setFromDate(""); setToDate(""); }}
                                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 overflow-x-auto">
                    {loadingWallet ? (
                        <div className="text-center py-8 text-slate-500 font-medium">Đang tải danh sách lịch sử...</div>
                    ) : (
                        <table className="w-full min-w-180 border-separate border-spacing-y-3 text-left text-sm">
                            <thead>
                                <tr className="text-slate-500">
                                    <th className="px-4 py-3">Ngày</th>
                                    <th className="px-4 py-3">Chi tiết</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3 text-right">Giá trị</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="rounded-2xl bg-slate-50">
                                        <td className="px-4 py-4 text-slate-700">{t.date}</td>
                                        <td className="px-4 py-4 text-slate-700">{t.detail}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'Thành công' || t.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-4 text-right font-semibold ${t.type === "inflow" ? "text-emerald-700" : "text-red-600"}`}>
                                            {t.amount}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Không có giao dịch phù hợp với bộ lọc.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal rút tiền */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Rút tiền</h2>
                        <p className="text-sm text-slate-500 mb-6">Số dư khả dụng: <span className="font-bold text-slate-900">{(balance || 0).toLocaleString('vi-VN')}đ</span></p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Số tiền muốn rút (đ)</label>
                            <input type="number" value={withdrawAmount} disabled={isSubmitting}
                                onChange={(e) => { setWithdrawAmount(e.target.value); setWithdrawError(""); }}
                                placeholder="Tối thiểu 50.000"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#49613E] focus:ring-1 focus:ring-[#49613E]" />
                            {withdrawError && <p className="mt-2 text-sm text-red-500 font-medium">{withdrawError}</p>}
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button type="button" disabled={isSubmitting}
                                onClick={() => { setIsWithdrawModalOpen(false); setWithdrawError(""); setWithdrawAmount(""); }}
                                className="flex-1 rounded-full bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                                Hủy bỏ
                            </button>
                            <button type="button" onClick={handleWithdraw} disabled={isSubmitting}
                                className="flex-1 rounded-full bg-[#49613E] py-3 text-sm font-semibold text-white transition hover:bg-[#384a2f] flex justify-center items-center">
                                {isSubmitting ? "Đang xử lý..." : "Xác nhận rút"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserWallet;
