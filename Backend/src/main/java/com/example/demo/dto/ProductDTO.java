package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private long maSanPham;
    private String tenSanPham;
    private int soLuong;
    private double giaSanPham;
    private String tenTheLoai;
    private int maTheLoai;
    private String tenTinhTrang;
    private int maTinhTrang;
    private String email;
    private long maNguoiBan;
    private String tenNguoiBan;
    private String hinhAnhDaiDien;
    private double danhGia;
    private int soLuongDanhGia;
    private List<String> hinhAnhs;
    private List<ReviewDTO> danhGias;
}