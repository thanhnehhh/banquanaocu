import { useNavigate } from "react-router-dom";

function NotPermission() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon khóa */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#1A1C19] mb-3">
          Không có quyền truy cập
        </h1>
        <p className="text-[#444840] text-sm mb-8">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
          viên nếu bạn cho rằng đây là lỗi.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-full border border-[#49613E] text-[#49613E] font-medium hover:bg-[#49613E] hover:text-white transition-colors"
          >
            ← Quay lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full bg-[#49613E] text-white font-medium hover:bg-[#3a4830] transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotPermission;
