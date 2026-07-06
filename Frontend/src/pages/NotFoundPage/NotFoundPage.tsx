import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center font-sans text-[#1A1C19] px-6">
            <div className="text-center max-w-lg">
                {/* 404 Number */}
                <h1 className="text-[120px] md:text-[150px] font-bold text-[#4d5e45] leading-none opacity-20 select-none">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-3 text-[#1A1C19]">
                    Không tìm thấy trang
                </h2>
                <p className="text-gray-500 mb-10 text-[15px] leading-relaxed">
                    Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không truy cập được. Hãy thử lại hoặc quay về trang chủ.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#4d5e45] text-white font-medium rounded-lg hover:bg-[#3A4930] transition-colors shadow-sm"
                    >
                        <Home className="w-4 h-4" />
                        Về Trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;