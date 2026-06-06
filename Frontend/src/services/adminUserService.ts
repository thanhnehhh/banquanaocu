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
}

export interface UserResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

// Lấy danh sách người dùng với phân trang
export const getUsers = (page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users", {
    params: { page, size },
  });

// Cập nhật trạng thái người dùng
export const updateUserStatus = (maNguoiDung: number, trangThai: number) =>
  axiosClient.put<unknown, { data: User }>(`/admin/users/${maNguoiDung}/status`, {
    trangThai,
  });

// Xóa người dùng
export const deleteUser = (maNguoiDung: number) =>
  axiosClient.delete<unknown, { data: void }>(`/admin/users/${maNguoiDung}`);

// Tìm kiếm người dùng
export const searchUsers = (searchTerm: string, page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users/search", {
    params: { q: searchTerm, page, size },
  });

// Lấy danh sách người dùng bị ẩn với phân trang
export const getHiddenUsers = (page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users/hidden", {
    params: { page, size },
  });

// Tìm kiếm người dùng bị ẩn
export const searchHiddenUsers = (searchTerm: string, page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: UserResponse }>("/admin/users/hidden/search", {
    params: { q: searchTerm, page, size },
  });
