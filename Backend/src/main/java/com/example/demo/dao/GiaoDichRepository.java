package com.example.demo.dao;

import com.example.demo.entity.GiaoDich;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiaoDichRepository extends JpaRepository<GiaoDich, Long> {
    // Lấy lịch sử giao dịch của user, sắp xếp mới nhất lên đầu
    List<GiaoDich> findByUser_MaNguoiDungOrderByNgayTaoDesc(Long maNguoiDung);
}