package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GioHangDTO {

    private long maGioHang;

    private List<GioHangItemDTO> items;

    private int tongSoLuong;

    private double tongTien;
}
