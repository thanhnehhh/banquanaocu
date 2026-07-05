package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.TrangThaiSanPhamDTO;
import com.example.demo.service.TrangThaiSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/conditions")
@RequiredArgsConstructor
public class TrangThaiSanPhamController {

    private final TrangThaiSanPhamService trangThaiSanPhamService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TrangThaiSanPhamDTO>>> getAllsTrangThaiSanPham() {
        List<TrangThaiSanPhamDTO> result = trangThaiSanPhamService.getAll();
        return ApiResponse.ok("Lấy danh sách trạng thái sản phẩm thành công", result);
    }
}
