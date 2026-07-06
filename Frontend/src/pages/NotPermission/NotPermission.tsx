import { useNavigate } from "react-router-dom";

function NotPermission() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-brand-primary p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 text-red-400 shadow-md shadow-red-500/10">
            <span className="text-3xl font-bold">!</span>
          </div>
          <h1 className="text-4xl font-semibold text-white">
            Không có quyền truy cập
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
            viên hoặc quay lại trang trước.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotPermission;
