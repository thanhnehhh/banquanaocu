import axiosClient from "@/service/axiosClient";

export type SellerListingFilter =
  | "ALL"
  | "ACTIVE"
  | "DEACTIVE"
  | "REJECTED"
  | "PENDING"
  | "SOLD_OUT";

export interface ProductImageSeller {
  maHinhAnh: number;
  tenHinhAnh: string;
  duongDan: string;
}

export interface ProductSellerDTO {
  maSanPham: number;
  tenSanPham: string;
  soLuong: number;
  giaSanPham: number;
  thuongHieu?: string;
  moTa?: string;
  mauSac?: string;
  kichCo?: string;
  trangThai: string;
  maTheLoai?: number;
  theLoai?: string;
  maTinhTrang?: number;
  tinhTrang?: string;
  active: boolean;
  soLuongDaBan: number;
  images: ProductImageSeller[];
}

export interface SellerProductsPage {
  content: ProductSellerDTO[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

/** Khớp ProductImageUpdateRequest backend */
export interface ProductImageUpdatePayload {
  /** null hoặc 0 = thêm mới; > 0 = cập nhật ảnh có sẵn */
  maHinhAnh?: number | null;
  tenAnh: string;
  duongDan: string;
}

export interface ProductUpdatePayload {
  tenSanPham?: string;
  soLuong?: number;
  giaBan?: number;
  moTa?: string;
  mauSac?: string;
  kichThuoc?: string;
  thuongHieu?: string;
  categoryId?: number;
  tinhTrangId?: number;
  images?: ProductImageUpdatePayload[];
  deleteImageIds?: number[];
}

export const getSellerProducts = (
  page: number,
  size: number,
  filter: SellerListingFilter,
) =>
  axiosClient.get<unknown, { data: SellerProductsPage }>("/products/seller", {
    params: { page, size, filter },
  });

export const activateSellerProduct = (productId: number) =>
  axiosClient.put<unknown, { message: string }>(
    `/products/${productId}/active`,
  );

export const deactivateSellerProduct = (productId: number) =>
  axiosClient.put<unknown, { message: string }>(
    `/products/${productId}/deactive`,
  );

export const updateSellerProduct = (
  productId: number,
  payload: ProductUpdatePayload,
) =>
  axiosClient.put<unknown, { message: string }>(
    `/products/${productId}`,
    payload,
  );

export function getDisplayStatusLabel(displayStatus: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Đang bán",
    PENDING: "Chờ duyệt",
    INACTIVE: "Tạm ngừng",
    REJECTED: "Từ chối",
    "SOLD OUT": "Hết hàng",
    APPROVED: "Đã duyệt",
  };
  return labels[displayStatus] ?? displayStatus;
}

export function getDisplayStatus(
  approvalStatus: string,
  active: boolean,
  inStock: number,
) {
  const status = approvalStatus?.toUpperCase() ?? "";
  if (status === "APPROVED") {
    if (!active) return "INACTIVE";
    if (inStock <= 0) return "SOLD OUT";
    return "ACTIVE";
  }
  if (status === "PENDING") return "PENDING";
  return status;
}

export function mapSellerProductToCard(product: ProductSellerDTO) {
  const approvalStatus = product.trangThai?.toUpperCase() ?? "";
  const inStock = product.soLuong;
  const displayStatus = getDisplayStatus(
    approvalStatus,
    product.active,
    inStock,
  );

  const image =
    product.images?.[0]?.duongDan ??
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";

  const isSoldOut = approvalStatus === "APPROVED" && inStock <= 0;

  return {
    id: product.maSanPham,
    name: product.tenSanPham,
    price: `${product.giaSanPham.toLocaleString("vi-VN")}đ`,
    priceValue: product.giaSanPham,
    image,
    displayStatus,
    approvalStatus,
    active: product.active,
    inStock,
    soLuongDaBan: product.soLuongDaBan,
    canToggleActive: approvalStatus === "APPROVED" && !isSoldOut,
    isSoldOut,
    moTa: product.moTa ?? "",
    mauSac: product.mauSac ?? "",
    kichCo: product.kichCo ?? "",
    thuongHieu: product.thuongHieu ?? "",
    maTheLoai: product.maTheLoai ?? 0,
    maTinhTrang: product.maTinhTrang ?? 0,
    images: product.images ?? [],
  };
}

export type SellProduct = ReturnType<typeof mapSellerProductToCard>;

export function patchSellProduct(
  product: SellProduct,
  patch: Partial<{
    active: boolean;
    inStock: number;
    name: string;
    priceValue: number;
    moTa: string;
    mauSac: string;
    kichCo: string;
    thuongHieu: string;
    maTheLoai: number;
    maTinhTrang: number;
    images: ProductImageSeller[];
    image: string;
  }>,
): SellProduct {
  const inStock = patch.inStock ?? product.inStock;
  const active = patch.active ?? product.active;
  const approvalStatus = product.approvalStatus;
  const isSoldOut = approvalStatus === "APPROVED" && inStock <= 0;
  const priceValue = patch.priceValue ?? product.priceValue;
  const images = patch.images ?? product.images;
  const image = patch.image ?? images[0]?.duongDan ?? product.image;

  return {
    ...product,
    ...patch,
    inStock,
    active,
    price: `${priceValue.toLocaleString("vi-VN")}đ`,
    priceValue,
    images,
    image,
    displayStatus: getDisplayStatus(approvalStatus, active, inStock),
    isSoldOut,
    canToggleActive: approvalStatus === "APPROVED" && !isSoldOut,
  };
}
