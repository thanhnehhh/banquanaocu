import type ImageUpload from "./ImageUpload";

export default class UploadProduct {
  tenSanPham: string;
  soLuong: number;
  giaBan: number;
  moTa: string;
  mauSac: string;
  kichThuoc: string;
  thuongHieu: string;
  categoryId: number;
  tinhTrangId: number;
  statusId?: number;
  images: ImageUpload[];

  constructor(
    tenSanPham: string,
    soLuong: number,
    giaBan: number,
    moTa: string,
    mauSac: string,
    kichThuoc: string,
    thuongHieu: string,
    categoryId: number,
    tinhTrangId: number,
    statusId: number | undefined,
    images: ImageUpload[],
  ) {
    this.tenSanPham = tenSanPham;
    this.soLuong = soLuong;
    this.giaBan = giaBan;
    this.moTa = moTa;
    this.mauSac = mauSac;
    this.kichThuoc = kichThuoc;
    this.thuongHieu = thuongHieu;
    this.categoryId = categoryId;
    this.tinhTrangId = tinhTrangId;
    this.statusId = statusId;
    this.images = images;
  }
}
