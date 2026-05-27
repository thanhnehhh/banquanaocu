package com.example.demo.dao;

import com.example.demo.entity.TinhTrang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TinhTrangRepository extends JpaRepository<TinhTrang, Integer> {
    boolean existsByTenTinhTrang(String tenTinhTrang);
    TinhTrang findByTenTinhTrang(String tenTinhTrang);
}