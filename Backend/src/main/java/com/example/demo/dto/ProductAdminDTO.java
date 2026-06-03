package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAdminDTO {
    private Long maSanPham;
    private String tenSanPham;
    private int soLuong;
    private double giaSanPham;
    private String emailSeller;
    private String trangThai;
    private boolean active;
    private ProductImageResponse images;
}
