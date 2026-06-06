import publicAxios from '@/service/publicAxios';
import axios from 'axios';

// Tạo instance riêng cho /home với base URL đúng
// Không dùng publicAxios.create() vì nó KHÔNG copy interceptors
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_MAIN_URL}/home`,
  headers: { "Content-Type": "application/json" },
});

// Copy response interceptor từ publicAxios để unwrap data
API.interceptors.response.use(
  (response) => response.data,
  (error) => { console.error("Home API Error:", error); return Promise.reject(error); },
);

export interface Category { maTheLoai: number; tenTheLoai: string; soSanPham: number; }
export interface Product { maSanPham: number; tenSanPham: string; giaSanPham: number; soLuong: number; hinhAnhDaiDien: string; tenTheLoai: string; maTheLoai: number; tenNguoiBan: string; danhGia: number; }
export interface ProductResponse { content: Product[]; totalPages: number; totalElements: number; currentPage: number; }
export interface Seller { maNguoiDung: number; hoTen: string; email: string; soDienThoai: string; diaChi: string; avatar: string; soSanPham: number; danhGiaXepHang: number; }

export const getHeroData = () => API.get('/hero');
export const getCategories = () => API.get<{ data: Category[] }>('/categories');
export const getNewestProducts = (limit: number = 10, excludeEmail?: string) =>
  API.get<{ data: Product[] }>('/products/newest', { params: { limit, excludeEmail } });
export const getBestSellingProducts = (page: number = 0, size: number = 10, excludeEmail?: string) =>
  API.get<{ data: ProductResponse }>('/products/best-selling', { params: { page, size, excludeEmail } });
export const getTopSellers = (limit: number = 8) =>
  API.get<{ data: Seller[] }>('/sellers/top-rated', { params: { limit } });
export const getProductsBySellerId = (sellerId: number, excludeProductId?: number, limit = 8) =>
  API.get<{ data: Product[] }>(`/sellers/${sellerId}/products`, { params: { limit, excludeProductId } });
