package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThuDanhMucDTO {
    private String tenDanhMuc;
    private Double doanhThu;
}
