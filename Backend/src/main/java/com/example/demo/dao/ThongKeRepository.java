package com.example.demo.dao;

import com.example.demo.dto.DoanhThuDanhMucDTO;
import com.example.demo.dto.DoanhThuNgayDTO;
import com.example.demo.entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongKeRepository extends JpaRepository<ChiTietDonHang, Long> {

    @Query("SELECT new com.example.demo.dto.DoanhThuNgayDTO(DAY(d.ngayTao), SUM(ct.soLuong * ct.giaBan)) " +
            "FROM ChiTietDonHang ct " +
            "JOIN ct.donHang d " +
            "JOIN ct.product p " +
            "WHERE p.user.maNguoiDung = :maSeller " +
            "AND YEAR(d.ngayTao) = :nam " +
            "AND MONTH(d.ngayTao) = :thang " +
            "AND d.trangThaiDonHang.id = 5 " +
            "GROUP BY DAY(d.ngayTao) " +
            "ORDER BY DAY(d.ngayTao) ASC")
    List<DoanhThuNgayDTO> thongKeDoanhThuTheoThang(
            @Param("maSeller") int maSeller,
            @Param("nam") int nam,
            @Param("thang") int thang
    );

    @Query("SELECT new com.example.demo.dto.DoanhThuDanhMucDTO(c.tenTheLoai, SUM(ct.soLuong * ct.giaBan)) " +
            "FROM ChiTietDonHang ct " +
            "JOIN ct.product p " +
            "JOIN p.category c " +
            "JOIN ct.donHang dh " +
            "WHERE p.user.maNguoiDung = :maSeller " +
            "AND MONTH(dh.ngayTao) = :thang " +
            "AND YEAR(dh.ngayTao) = :nam " +
            "AND dh.trangThaiDonHang.id = 5 " +
            "GROUP BY c.tenTheLoai")
    List<DoanhThuDanhMucDTO> thongKeDoanhThuTheoDanhMuc(
            @Param("maSeller") int maSeller,
            @Param("thang") int thang,
            @Param("nam") int nam
    );
}
