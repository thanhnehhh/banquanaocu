package com.example.demo.service;

import com.example.demo.dto.AdminThongKeDTO;
import com.example.demo.dto.DoanhThuDanhMucDTO;
import com.example.demo.dto.DoanhThuNgayDTO;

import java.util.List;

public interface ThongKeService {
    List<DoanhThuNgayDTO> getDoanhThuTheoThang(int maSeller, int nam, int thang);
    List<DoanhThuDanhMucDTO> getDoanhThuTheoDanhMuc(int maSeller, int thang, int nam);
    List<DoanhThuNgayDTO> getDoanhThuTheoKhoangNgay(int maSeller, java.time.LocalDate tuNgay, java.time.LocalDate denNgay);
    List<DoanhThuDanhMucDTO> getDoanhThuDanhMucTheoKhoangNgay(int maSeller, java.time.LocalDate tuNgay, java.time.LocalDate denNgay);
    AdminThongKeDTO getAdminThongKe(int nam);
}
