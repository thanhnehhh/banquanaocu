import axiosClient from "@/service/axiosClient";

export interface CartItemDTO {
  maItem: number;
  maSanPham: number;
  tenSanPham: string;
  giaSanPham: number;
  soLuong: number;
  hinhAnh: string;
  tenNguoiBan: string;
  soLuongTonKho: number;
}

export interface CartDTO {
  maGioHang: number;
  items: CartItemDTO[];
  tongSoLuong: number;
  tongTien: number;
}

export const getCart = () =>
  axiosClient.get<unknown, { data: CartDTO }>("/cart");

export const addToCart = (maSanPham: number, soLuong: number) =>
  axiosClient.post<unknown, { data: CartDTO }>("/cart/add", { maSanPham, soLuong });

export const removeFromCart = (maItem: number) =>
  axiosClient.delete<unknown, { data: CartDTO }>(`/cart/item/${maItem}`);

export const updateCartItemQty = (maItem: number, soLuong: number) =>
  axiosClient.put<unknown, { data: CartDTO }>(`/cart/item/${maItem}`, { soLuong });

export const clearCart = () => axiosClient.delete("/cart");
