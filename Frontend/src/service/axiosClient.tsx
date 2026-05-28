import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_MAIN_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Tự động gắn token vào header trước khi gửi request
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

// Xử lý khi token hết hạn (401)
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_MAIN_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }, // Gửi kèm HttpOnly cookie chứa refresh token
                );

                // API trả về form ApiResponse: { data: { token: "..." } }
                const newToken = response.data?.data?.token || response.data?.token;

                if (newToken) {
                    localStorage.setItem("token", newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
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