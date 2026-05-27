package com.example.demo.service.impl;

import com.example.demo.dao.CategoryRepository;
import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.Category;
import com.example.demo.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getCategoryById(int id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(this::convertToDTO).orElse(null);
    }

    @Override
    public CategoryDTO getCategoryByName(String name) {
        Category category = categoryRepository.findByTenTheLoai(name);
        return category != null ? convertToDTO(category) : null;
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setMaTheLoai(category.getMaTheLoai());
        dto.setTenTheLoai(category.getTenTheLoai());

        if (category.getProducts() != null) {
            dto.setSoSanPham(category.getProducts().size());
        } else {
            dto.setSoSanPham(0);
        }
        return dto;
    }
}