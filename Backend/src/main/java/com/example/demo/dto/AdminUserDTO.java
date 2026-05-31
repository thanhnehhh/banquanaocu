package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long maNguoiDung;
    private String email;
    private String hoDem;
    private String ten;
    private String avatar;
    private String diaChi;
    private Character gioiTinh;
    private LocalDate ngaySinh;
    private Integer trangThai; // 1 = active, 0 = inactive
}
