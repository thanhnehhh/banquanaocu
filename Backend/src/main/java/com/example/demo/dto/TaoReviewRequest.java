package com.example.demo.dto;

import lombok.Data;

@Data
public class TaoReviewRequest {
    private long maSanPham;
    private float diemXepHang; // 1-5
    private String nhanXet;
}

