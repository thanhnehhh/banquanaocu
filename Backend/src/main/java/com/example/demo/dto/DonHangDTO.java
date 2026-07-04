package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonHangDTO {

    private int maDonHang;

    private String ngayTao;

    private String diaChiNhanHang;

    private double chiPhiGiaoHang;

    private double tongTienSanPham;

    private double tongTien;

    private String trangThai; // "Chờ xác nhận" | "Đang giao" | "Hoàn thành" | "Đã hủy"

    private String lyDoHuy;

    private String phuongThucThanhToan;

    private Integer maDonHangCha;

    private String tenKhachHang;

    private String emailKhachHang;

    private String sdtKhachHang;

    private String tenNguoiBan;

    private String emailNguoiBan;

    private String tenShop;

    private String sdtShop;

    private List<ChiTietDonHangDTO> chiTiet;
}
