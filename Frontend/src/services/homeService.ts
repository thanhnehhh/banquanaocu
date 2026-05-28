// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import publicAxios from '@/service/publicAxios';

const API = publicAxios.create({
    baseURL: `${publicAxios.defaults.baseURL}/home`
});

// Định nghĩa chuẩn Response từ Backend
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Category {
    maTheLoai: number;
    tenTheLoai: string;
    soSanPham: number;
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

export const getHeroData = () =>
    API.get<ApiResponse<HeroData>>('/hero');

export const getCategories = () =>
    API.get<ApiResponse<Category[]>>('/categories');

export const getNewestProducts = (limit: number = 10) =>
    API.get<ApiResponse<Product[]>>('/products/newest', { params: { limit } });

export const getBestSellingProducts = (page: number = 0, size: number = 10) =>
    API.get<ApiResponse<ProductResponse>>('/products/best-selling', { params: { page, size } });

export const getTopSellers = (limit: number = 8) =>
    API.get<ApiResponse<Seller[]>>('/sellers/top-rated', { params: { limit } });