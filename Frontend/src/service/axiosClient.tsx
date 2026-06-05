import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_MAIN_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor: Xử lý khi token hết hạn (401)
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Bắt lỗi 401 Unauthorized và đảm bảo chưa từng retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_MAIN_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true },
                );

                // API trả về access token mới (bạn nhớ check xem backend trả biến tên là gì nhé)
                const newToken = response.data.token || response.data?.data?.token;

                if (newToken) {
                    // Lưu Access Token mới vào LocalStorage
                    localStorage.setItem("token", newToken);

                    // Cập nhật lại cái token mới này vào cái request bị lỗi ban nãy
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Gọi lại cái request ban nãy một lần nữa
                    return axiosClient(originalRequest);
                }
            } catch (err) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosClient;
