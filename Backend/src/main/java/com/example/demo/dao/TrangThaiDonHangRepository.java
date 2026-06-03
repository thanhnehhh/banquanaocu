package com.example.demo.dao;

import com.example.demo.entity.TrangThaiDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrangThaiDonHangRepository extends JpaRepository<TrangThaiDonHang, Integer> {
    Optional<TrangThaiDonHang> findByTenTrangThai(String tenTrangThai);
}
