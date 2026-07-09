package com.example.demo.controller;

import com.example.demo.dto.DoanhThuDanhMucDTO;
import com.example.demo.dto.DoanhThuNgayDTO;
import com.example.demo.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thong-ke")
@RequiredArgsConstructor
public class ThongKeController {

    private final ThongKeService thongKeService;

    @GetMapping("/seller/{maSeller}")
    public ResponseEntity<List<DoanhThuNgayDTO>> layDoanhThuCuaSeller(
            @PathVariable("maSeller") int maSeller,
            @RequestParam("nam") int nam,
            @RequestParam("thang") int thang) {
        List<DoanhThuNgayDTO> data = thongKeService.getDoanhThuTheoThang(maSeller, nam, thang);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/seller/{maSeller}/danh-muc")
    public ResponseEntity<List<DoanhThuDanhMucDTO>> getDoanhThuTheoDanhMuc(
            @PathVariable("maSeller") int maSeller,
            @RequestParam("thang") int thang,
            @RequestParam("nam") int nam) {
        List<DoanhThuDanhMucDTO> result = thongKeService.getDoanhThuTheoDanhMuc(maSeller, thang, nam);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/seller/{maSeller}/khoang-ngay")
    public ResponseEntity<List<DoanhThuNgayDTO>> getDoanhThuTheoKhoangNgay(
            @PathVariable("maSeller") int maSeller,
            @RequestParam("tuNgay") String tuNgay,
            @RequestParam("denNgay") String denNgay) {
        java.time.LocalDate tu = java.time.LocalDate.parse(tuNgay);
        java.time.LocalDate den = java.time.LocalDate.parse(denNgay);
        return ResponseEntity.ok(thongKeService.getDoanhThuTheoKhoangNgay(maSeller, tu, den));
    }

    @GetMapping("/seller/{maSeller}/danh-muc/khoang-ngay")
    public ResponseEntity<List<DoanhThuDanhMucDTO>> getDoanhThuDanhMucTheoKhoangNgay(
            @PathVariable("maSeller") int maSeller,
            @RequestParam("tuNgay") String tuNgay,
            @RequestParam("denNgay") String denNgay) {
        java.time.LocalDate tu = java.time.LocalDate.parse(tuNgay);
        java.time.LocalDate den = java.time.LocalDate.parse(denNgay);
        return ResponseEntity.ok(thongKeService.getDoanhThuDanhMucTheoKhoangNgay(maSeller, tu, den));
    }
}
