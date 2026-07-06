import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHeroData } from '@/services/homeService';
import heroImg from "@/assets/hero.png";

interface HeroData {
    title?: string;
    description?: string;
}

const Hero = () => {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHeroData()
            .then((res) => setHeroData(res.data || res))
            .catch((err) => console.error('Error fetching hero data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Đang tải...</p>
                </div>
            </section>
        );
    }

    const title = heroData?.title || 'CHÀO MỪNG TỚI\nCHỢ ĐỒ CŨ';
    const description = heroData?.description || 'Hãy trải nghiệm chợ đồ cũ tốt nhất ở Việt Nam của chúng tôi đi nào mọi người';

    return (
        <section className="max-w-[1200px] mx-auto px-6 py-16">

            <div className="flex items-center justify-between gap-12">

                {/* LEFT CONTENT */}
                <div className="flex-1">
                    <h1 className="text-[48px] leading-[56px] font-extrabold text-[#1A1C19]">
                        {title}
                    </h1>

                    <p className="mt-4 text-[16px] text-[#444840] max-w-[420px]">
                        {description}
                    </p>

                    <Link to="/search" className="inline-block mt-6 px-6 h-[44px] bg-[#49613E] text-white rounded-full font-medium hover:bg-[#3a4830] transition leading-[44px]">
                        Mua sắm ngay →
                    </Link>
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex-1 flex justify-end">
                    <div className="w-[420px] h-[500px] rounded-[24px] overflow-hidden">
                        <img
                            src={heroImg}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

            </div>

        </section>
    );
};

export default Hero;