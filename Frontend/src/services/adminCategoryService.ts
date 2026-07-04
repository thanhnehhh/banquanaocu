import axiosClient from "@/service/axiosClient";

export interface CategoryDTO {
  maTheLoai: number;
  tenTheLoai: string;
  soSanPham: number;
  active: boolean;
}

export interface CategoryResponse {
  content: CategoryDTO[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

export const getCategories = (page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: CategoryResponse }>("/admin/categories", {
    params: { page, size },
  });

export const searchCategories = (searchTerm: string, page: number = 0, size: number = 10) =>
  axiosClient.get<unknown, { data: CategoryResponse }>("/admin/categories/search", {
    params: { q: searchTerm, page, size },
  });

export const createCategory = (categoryData: Omit<CategoryDTO, "maTheLoai" | "soSanPham">) =>
  axiosClient.post<unknown, { data: CategoryDTO }>("/admin/categories", categoryData);

export const updateCategory = (maTheLoai: number, categoryData: Omit<CategoryDTO, "maTheLoai" | "soSanPham">) =>
  axiosClient.put<unknown, { data: CategoryDTO }>(`/admin/categories/${maTheLoai}`, categoryData);

export const deleteCategory = (maTheLoai: number) =>
  axiosClient.delete<unknown, { data: void }>(`/admin/categories/${maTheLoai}`);
