package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerDTO {
    private long maNguoiDung;
    private String email;
    private String hoTen;
    private String soDienThoai;
    private String diaChi;
    private String avatar;
    private long soSanPham;
    private double danhGiaXepHang;
}