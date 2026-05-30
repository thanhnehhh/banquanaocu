package com.example.demo.dao;

import com.example.demo.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GioHangRepository extends JpaRepository<GioHang, Long> {

    Optional<GioHang> findByUserMaNguoiDung(long maNguoiDung);
}
