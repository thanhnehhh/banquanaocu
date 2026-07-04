package com.example.demo.dao;

import com.example.demo.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findByTenTheLoai(String tenTheLoai);
    Page<Category> findByTenTheLoaiContainingIgnoreCase(String keyword, Pageable pageable);
}