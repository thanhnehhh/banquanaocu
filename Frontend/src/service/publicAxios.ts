import axios from "axios";

// Instance dành riêng cho các API public (không cần đăng nhập)
// Ví dụ: Lấy danh sách sản phẩm, Xem bài viết, Danh mục...
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_MAIN_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

publicAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

// Chú ý: Ở đây chúng ta KHÔNG KHAI BÁO bất kỳ interceptor nào để đính kèm Token.
// Vì vậy, khi bạn dùng publicAxios gọi API, nó sẽ hoàn toàn không gửi kèm Bearer Token lên Backend.
// -> Tránh được việc Backend báo lỗi Token hết hạn với các request không cần thiết!

export default publicAxios;
