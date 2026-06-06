interface ProductPending {
  maSanPham: number;
  tenSanPham: string;
  giaSanPham: number;
  soLuong: number;
  emailSeller: string;
  trangThai: string;
  images: { duongDan: string; tenAnd?: string }[];
}

export default ProductPending;
