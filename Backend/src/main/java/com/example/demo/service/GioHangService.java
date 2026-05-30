package com.example.demo.service;

import com.example.demo.dto.GioHangDTO;

public interface GioHangService {

    GioHangDTO getGioHang(String email);

    GioHangDTO themVaoGioHang(String email, long maSanPham, int soLuong);

    GioHangDTO xoaKhoiGioHang(String email, long maItem);

    GioHangDTO capNhatSoLuong(String email, long maItem, int soLuongMoi);

    void xoaGioHang(String email);
}
