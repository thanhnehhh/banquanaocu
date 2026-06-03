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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", maxAge = 3600)
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
}
