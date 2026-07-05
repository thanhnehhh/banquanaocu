import type Token from "./Token";

export default class User {
  email: string;
  role: string[];
  avatar?: string;
  hoDem?: string;
  name?: string;
  phone?: string;
  gioiTinh?: string;
  token?: Token;
  googleId?: string;
  hobby?: string;
  createAt?: string;
  birthday?: string;
  address?: string;
  maNguoiDung?: number;

  constructor(email: string, role: string[], avatar?: string, hoDem?: string, name?: string, phone?: string, gioiTinh?: string, token?: Token, googleId?: string, hobby?: string, createAt?: string, birthday?: string, address?: string, maNguoiDung?: number) {
    this.email = email; this.role = role; this.avatar = avatar; this.hoDem = hoDem; this.name = name;
    this.phone = phone; this.gioiTinh = gioiTinh; this.token = token; this.googleId = googleId;
    this.hobby = hobby; this.createAt = createAt; this.birthday = birthday; this.address = address;
    this.maNguoiDung = maNguoiDung;
  }
}
