package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    /**
     * POST /api/files/upload-image
     * Nhận file ảnh, convert sang base64 data URL và trả về.
     * Ảnh sẽ được lưu vào cột du_lieu_anh (LONGTEXT) trong bảng hinh_anh.
     */
    @PostMapping("/upload-image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        try {
            if (file.isEmpty()) {
                return ApiResponse.error(org.springframework.http.HttpStatus.BAD_REQUEST,
                        "File không được để trống");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ApiResponse.error(org.springframework.http.HttpStatus.BAD_REQUEST,
                        "Chỉ chấp nhận file ảnh");
            }

            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String dataUrl = "data:" + contentType + ";base64," + base64;

            return ApiResponse.ok("Upload ảnh thành công",
                    Map.of("url", dataUrl, "fileName", file.getOriginalFilename()));

        } catch (Exception e) {
            return ApiResponse.error(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR,
                    "Upload ảnh thất bại: " + e.getMessage());
        }
    }
}
