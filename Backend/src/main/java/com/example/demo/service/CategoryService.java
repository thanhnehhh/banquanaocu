package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.dto.PageResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryById(int id);
    CategoryDTO getCategoryByName(String name);

    /** Lấy danh sách danh mục phân trang (dùng cho Admin) */
    PageResponse<CategoryDTO> getAllCategories(int page, int size);

    /** Tìm kiếm danh mục phân trang */
    PageResponse<CategoryDTO> searchCategories(String keyword, int page, int size);

    /** Tạo danh mục mới */
    CategoryDTO createCategory(CategoryDTO categoryDTO);

    /** Cập nhật danh mục */
    CategoryDTO updateCategory(int id, CategoryDTO categoryDTO);

    /** Xóa danh mục (soft delete - set active = false) */
    void deleteCategory(int id);
}