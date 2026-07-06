import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function KichHoatTaiKhoan() {
  const [daKichHoat, setDaKichHoat] = useState(false);
  const [thongBao, setThongBao] = useState("Đang kích hoạt tài khoản...");
  const [loading, setLoading] = useState(true);

  const { maKichHoat } = useParams();

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_MAIN_URL}/auth/kich-hoat?ma=${maKichHoat}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDaKichHoat(true);
          setThongBao("Tài khoản của bạn đã được kích hoạt thành công.");
        } else {
          setThongBao(data.message || "Kích hoạt thất bại. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        setThongBao(error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [maKichHoat]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {loading ? (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Đang kích hoạt
            </h1>

            <p className="text-gray-500">Vui lòng chờ trong giây lát...</p>
          </>
        ) : daKichHoat ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-green-600">✓</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Kích hoạt thành công
            </h1>

            <p className="text-gray-600 mb-6">{thongBao}</p>

            <Link
              to="/login"
              className="inline-block bg-green-600 hover:bg-green-700 transition text-white font-medium px-6 py-3 rounded-xl"
            >
              Đăng nhập ngay
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-red-600">✕</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Kích hoạt thất bại
            </h1>

            <p className="text-gray-600 mb-6">{thongBao}</p>

            <Link
              to="/"
              className="inline-block bg-red-600 hover:bg-red-700 transition text-white font-medium px-6 py-3 rounded-xl"
            >
              Quay về trang chủ
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default KichHoatTaiKhoan;
