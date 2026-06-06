import axios from "axios";

const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_MAIN_URL,
  headers: { "Content-Type": "application/json" },
});

publicAxios.interceptors.response.use(
  (response) => response.data,
  (error) => { console.error("API Error:", error); return Promise.reject(error); },
);

export default publicAxios;
