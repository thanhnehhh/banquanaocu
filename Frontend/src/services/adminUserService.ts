import axiosClient from "@/service/axiosClient";

export interface User {
  maNguoiDung: number;
  email: string;
  hoDem: string;
  ten: string;
  avatar: string;
  diaChi: string;
  gioiTinh: string;
  ngaySinh: string;
  trangThai: number;
  roles?: string[];
}

export interface UserResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

export const getUsers = (page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users", { params: { page, size } });

export const updateUserStatus = (maNguoiDung: number, trangThai: number) =>
  axiosClient.put<unknown, { data: User }>(`/admin/users/${maNguoiDung}/status`, { trangThai });

export const deleteUser = (maNguoiDung: number) =>
  axiosClient.delete<unknown, { data: void }>(`/admin/users/${maNguoiDung}`);

export const searchUsers = (searchTerm: string, page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users/search", { params: { q: searchTerm, page, size } });

export const getHiddenUsers = (page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users/hidden", { params: { page, size } });

export const searchHiddenUsers = (searchTerm: string, page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users/hidden/search", { params: { q: searchTerm, page, size } });

export const createUser = (userData: Omit<User, "maNguoiDung" | "avatar">) =>
  axiosClient.post<unknown, { data: User }>("/admin/users", userData);

export const updateUser = (maNguoiDung: number, userData: Omit<User, "maNguoiDung" | "avatar">) =>
  axiosClient.put<unknown, { data: User }>(`/admin/users/${maNguoiDung}`, userData);
