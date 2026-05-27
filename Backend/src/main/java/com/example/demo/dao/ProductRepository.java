package com.example.demo.dao;

import com.example.demo.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryMaTheLoai(int maTheLoai);

    List<Product> findByUserMaNguoiDung(long maNguoiDung);

    @Query(nativeQuery = true,
            value = "SELECT p.* FROM product p " +
                    "LEFT JOIN chi_tiet_don_hang ctdh ON p.ma_san_pham = ctdh.ma_san_pham " +
                    "GROUP BY p.ma_san_pham " +
                    "ORDER BY SUM(COALESCE(ctdh.so_luong, 0)) DESC",
            countQuery = "SELECT COUNT(DISTINCT p.ma_san_pham) FROM product p " +
                    "LEFT JOIN chi_tiet_don_hang ctdh ON p.ma_san_pham = ctdh.ma_san_pham")
    Page<Product> findBestSellingProducts(Pageable pageable);

    Page<Product> findByTenSanPhamContainingIgnoreCase(String tenSanPham, Pageable pageable);

    Page<Product> findByCategoryMaTheLoai(int maTheLoai, Pageable pageable);

    Page<Product> findByTinhTrangMaTinhTrang(int maTinhTrang, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE " +
            "(:tenSanPham IS NULL OR LOWER(p.tenSanPham) LIKE LOWER(CONCAT('%', :tenSanPham, '%'))) " +
            "AND (:maTheLoai IS NULL OR p.category.maTheLoai = :maTheLoai) " +
            "AND (:maTinhTrang IS NULL OR p.tinhTrang.maTinhTrang = :maTinhTrang) " +
            "AND (:giaMin IS NULL OR p.giaSanPham >= :giaMin) " +
            "AND (:giaMax IS NULL OR p.giaSanPham <= :giaMax)")
    Page<Product> searchProducts(
            @Param("tenSanPham") String tenSanPham,
            @Param("maTheLoai") Integer maTheLoai,
            @Param("maTinhTrang") Integer maTinhTrang,
            @Param("giaMin") Double giaMin,
            @Param("giaMax") Double giaMax,
            Pageable pageable
    );
}