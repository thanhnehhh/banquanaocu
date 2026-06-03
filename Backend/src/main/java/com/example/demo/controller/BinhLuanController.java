package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.BinhLuanDTO;
import com.example.demo.dto.TaoBinhLuanRequest;
import com.example.demo.service.BinhLuanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class BinhLuanController {

    private final BinhLuanService binhLuanService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BinhLuanDTO>>> getBinhLuan(
            @RequestParam long maSanPham) {
        List<BinhLuanDTO> binhLuans = binhLuanService.getBinhLuanByProduct(maSanPham);
        return ApiResponse.ok("Lấy bình luận thành công!", binhLuans);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BinhLuanDTO>> taoBinhLuan(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TaoBinhLuanRequest request) {
        BinhLuanDTO binhLuan = binhLuanService.taoBinhLuan(userDetails.getUsername(), request);
        return ApiResponse.ok("Bình luận thành công!", binhLuan);
    }

    @DeleteMapping("/{maBinhLuan}")
    public ResponseEntity<ApiResponse<Void>> xoaBinhLuan(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable long maBinhLuan) {
        binhLuanService.xoaBinhLuan(userDetails.getUsername(), maBinhLuan);
        return ApiResponse.ok("Xóa bình luận thành công!");
    }
}
