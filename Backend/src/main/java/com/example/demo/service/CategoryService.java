package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryById(int id);
    CategoryDTO getCategoryByName(String name);
}