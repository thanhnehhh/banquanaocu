package com.example.demo.dao;

import com.example.demo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByProductMaSanPhamAndUserMaNguoiDung(long maSanPham, long maNguoiDung);

    List<Review> findByProductMaSanPham(long maSanPham);

    long countByProductMaSanPham(long maSanPham);

    @Query("SELECT COALESCE(AVG(r.diemXepHang), 0) FROM Review r WHERE r.product.maSanPham = :maSanPham")
    double avgDiemByProductMaSanPham(@Param("maSanPham") long maSanPham);
}
