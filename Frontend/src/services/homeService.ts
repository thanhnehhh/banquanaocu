import publicAxios from '@/service/publicAxios';

// Sử dụng publicAxios với baseURL /api/home
const API = publicAxios.create({
  baseURL: `${publicAxios.defaults.baseURL}/home`
});

export interface Category {
  maTheLoai: number;
  tenTheLoai: string;
  soSanPham: number;
  active?: boolean;
}

export interface Product {
  maSanPham: number;
  tenSanPham: string;
  giaSanPham: number;
  soLuong: number;
  hinhAnhDaiDien: string;
  tenTheLoai: string;
  maTheLoai: number;
  tenNguoiBan: string;
  danhGia: number;
}

export interface ProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export interface Seller {
  maNguoiDung: number;
  hoTen: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
  avatar: string;
  soSanPham: number;
  danhGiaXepHang: number;
}

export interface HeroData {
  title: string;
  description: string;
}

export const getHeroData = () => API.get('/hero');
export const getCategories = () => API.get<{ data: Category[] }>('/categories');
export const getNewestProducts = (limit: number = 10, excludeEmail?: string) => 
  API.get<{ data: Product[] }>('/products/newest', { params: { limit, excludeEmail } });
export const getBestSellingProducts = (page: number = 0, size: number = 10, excludeEmail?: string) => 
  API.get<{ data: ProductResponse }>('/products/best-selling', { params: { page, size, excludeEmail } });
export const getTopSellers = (limit: number = 8) => 
  API.get<{ data: Seller[] }>('/sellers/top-rated', { params: { limit } });

/** Lấy sản phẩm của một người bán cụ thể */
export const getProductsBySellerId = (sellerId: number, excludeProductId?: number, limit = 8) =>
  API.get<{ data: Product[] }>(`/sellers/${sellerId}/products`, {
    params: { limit, excludeProductId },
  });
