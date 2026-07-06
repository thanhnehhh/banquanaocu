import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import ProductCard from "@/components/common/ProductCard";
import { getNewestProducts, getBestSellingProducts } from '@/services/homeService';
import type { Product, ProductResponse } from '@/services/homeService';

interface ProductSectionProps {
    title: string;
}

const ProductSection = ({ title }: ProductSectionProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: false,
        skipSnaps: false,
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const user = useSelector((state: RootState) => state.auth.user);
    const userEmail = user?.email || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const isNewest = title.toLowerCase().includes('mới');

    useEffect(() => {
        if (!emblaApi) return;
        
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };
        
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        
        // Call once on mount
        onSelect();
        
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi]);

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                if (isNewest) {
                    const res = await getNewestProducts(10, userEmail);
                    const data = res.data ? (Array.isArray(res.data) ? res.data : res.data.data || res.data) : res;
                    setProducts(Array.isArray(data) ? data : []);
                } else {
                    // Lấy sản phẩm bán chạy nhất (page 0, 10 sản phẩm)
                    const res = await getBestSellingProducts(0, 10, userEmail);
                    const pageData = (res.data?.data || res.data) as ProductResponse;
                    setProducts(pageData.content || []);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isNewest, userEmail]);

    if (loading) {
        return (
            <section className="w-full px-6 lg:px-10">
                <h2 className="text-xl font-semibold text-[#4E6A4E] mb-6">{title}</h2>
                <div className="text-center py-12 text-gray-500">Đang tải sản phẩm...</div>
            </section>
        );
    }

    const filteredProducts = products.filter(p => p.soLuong > 0);

    if (filteredProducts.length === 0) {
        return (
            <section className="w-full px-6 lg:px-10">
                <h2 className="text-xl font-semibold text-[#4E6A4E] mb-6">{title}</h2>
                <div className="text-center py-12 text-gray-500">Không có sản phẩm nào</div>
            </section>
        );
    }

    // Đoạn xử lý map dữ liệu tự động làm sạch chuỗi ảnh đại diện
    const mappedProducts = filteredProducts.map(p => {
        return {
            id: p.maSanPham,
            title: p.tenSanPham,
            price: `${p.giaSanPham.toLocaleString('vi-VN')}đ`,
            seller: `@${p.tenNguoiBan}`,
            // Nếu có link Supabase thì dùng, không thì lấy ảnh mặc định
            image: p.hinhAnhDaiDien ? p.hinhAnhDaiDien : '/images/placeholder.jpg',
            tag: `${p.danhGia.toFixed(1)}⭐`,
            maxQuantity: p.soLuong,
        };
    });

    return (
        <section className="w-full px-6 lg:px-10 py-8 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center mb-8 relative">
                <h2 className="text-3xl font-bold text-[#4E6A4E] italic tracking-wide">
                    {title}
                </h2>
                <Link to="/search" className="absolute right-0 text-sm font-medium text-[#4E6A4E] hover:text-[#3a5c31] transition-colors flex items-center gap-1">
                    Xem tất cả <span className="text-lg">→</span>
                </Link>
            </div>

            {/* Carousel Container */}
            <div className="relative -mx-6 lg:-mx-10 px-6 lg:px-10">
                <div 
                    className="overflow-hidden"
                    ref={emblaRef}
                >
                    <div className="flex gap-6">
                        {mappedProducts.map((item) => (
                            <div key={item.id} className="flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(25%-18px)]">
                                <ProductCard {...item} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                {mappedProducts.length > 0 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#4E6A4E] text-white shadow-lg hover:bg-[#3a5c31] disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        
                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#4E6A4E] text-white shadow-lg hover:bg-[#3a5c31] disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default ProductSection;