import { useEffect, useState } from 'react';
import { getTopSellers } from '@/services/homeService';
import type { Seller } from '@/services/homeService';

const SellerSection = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTopSellers(8).then((res) => {
            const data = res.data ? (Array.isArray(res.data) ? res.data : (res.data as any).data || res.data) : res;
            setSellers(Array.isArray(data) ? data : []);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <section className="bg-[#F5F5F3] py-16"><div className="text-center py-12 text-gray-500">Đang tải...</div></section>;
    if (sellers.length === 0) return <section className="bg-[#F5F5F3] py-16"><div className="text-center py-12 text-gray-500">Không có người bán</div></section>;

    return (
        <section className="bg-[#F5F5F3] py-16">
            <div className="max-w-[1200px] mx-auto px-6 text-center">
                <h2 className="text-2xl font-semibold text-[#4E6A4E]">Cộng đồng người bán</h2>
                <p className="text-sm text-gray-600 mt-2">Những thành viên tích cực nhất trên nền tảng</p>
                <div className="grid md:grid-cols-4 gap-6 mt-10">
                    {sellers.map((s) => (
                        <div key={s.maNguoiDung} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto overflow-hidden flex items-center justify-center">
                                {s.avatar ? <img src={s.avatar} alt={s.hoTen} className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>}
                            </div>
                            <h3 className="mt-4 font-medium line-clamp-1">{s.hoTen}</h3>
                            <p className="text-xs text-yellow-500 font-bold">⭐ {s.danhGiaXepHang.toFixed(1)}/5</p>
                            <p className="text-sm mt-3 text-gray-600">{s.soSanPham} sản phẩm</p>
                            <button className="mt-4 w-full bg-[#49613E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3a4830] transition">Ghé thăm Store</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SellerSection;
