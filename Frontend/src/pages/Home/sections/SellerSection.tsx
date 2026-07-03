import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTopSellers } from '@/services/homeService';
import type { Seller } from '@/services/homeService';
import type { RootState } from '@/redux/store';

const SellerSection = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);
    const currentEmail = useSelector((state: RootState) => state.auth.user?.email);

    useEffect(() => {
        getTopSellers(8)
            .then((res) => {
                const raw = res.data
                    ? (Array.isArray(res.data) ? res.data : (res.data as { data: Seller[] }).data || res.data)
                    : res;
                const list = Array.isArray(raw) ? raw : [];
                // Lọc không hiện bản thân
                setSellers(currentEmail ? list.filter((s: Seller) => s.email !== currentEmail) : list);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [currentEmail]);

    if (loading) return (
        <section className="bg-[#F5F5F3] py-16">
            <div className="max-w-[1200px] mx-auto px-6 text-center">
                <div className="py-12 text-gray-500">Đang tải người bán...</div>
            </div>
        </section>
    );

    if (sellers.length === 0) return null;

    return (
        <section className="bg-[#F5F5F3] py-16">
            <div className="max-w-[1200px] mx-auto px-6 text-center">
                <h2 className="text-2xl font-semibold text-[#4E6A4E]">Cộng đồng người bán</h2>
                <p className="text-sm text-gray-600 mt-2">Những thành viên tích cực nhất trên nền tảng</p>
                <div className="grid md:grid-cols-4 gap-6 mt-10">
                    {sellers.map((s) => (
                        <div key={s.maNguoiDung} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto overflow-hidden flex items-center justify-center">
                                {s.avatar
                                    ? <img src={s.avatar} alt={s.hoTen} className="w-full h-full object-cover" />
                                    : <span className="text-2xl">👤</span>
                                }
                            </div>
                            <h3 className="mt-4 font-medium line-clamp-1">
                                {/* Bỏ "null " nếu hoTen bắt đầu bằng "null " */}
                                {s.hoTen?.startsWith('null ') ? s.hoTen.slice(5) : s.hoTen}
                            </h3>
                            <p className="text-xs text-yellow-500 font-bold">⭐ {s.danhGiaXepHang.toFixed(1)}/5</p>
                            <p className="text-sm mt-3 text-gray-600">
                                {s.soSanPham} sản phẩm{s.soDienThoai ? ` • ${s.soDienThoai}` : ''}
                            </p>
                            <Link
                                to={`/store/${s.maNguoiDung}`}
                                className="mt-4 block w-full bg-[#49613E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3a4830] transition text-center"
                            >
                                Ghé thăm Store
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SellerSection;
