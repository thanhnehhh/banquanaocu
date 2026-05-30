package com.example.demo.dao;

import com.example.demo.entity.TrangThaiSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrangThaiSanPhamRepository extends JpaRepository<TrangThaiSanPham, Integer> {

    Optional<TrangThaiSanPham> findByTenTrangThai(String tenTrangThai);
}
