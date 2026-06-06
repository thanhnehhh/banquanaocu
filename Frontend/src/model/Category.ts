export default class Category {
  id: number;
  tenDanhMuc: string;

  constructor(id: number, tenDanhMuc: string) {
    this.id = id;
    this.tenDanhMuc = tenDanhMuc;
  }
}
