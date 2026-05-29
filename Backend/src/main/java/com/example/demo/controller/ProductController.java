package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ProductForSaleRequest;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductService productService;

    @PostMapping("/post")
    public ResponseEntity<ApiResponse<Void>> dangSanPham(
            @Valid @RequestBody ProductForSaleRequest request,
            Authentication authentication
    ) {
        productService.postProduct(request, authentication.getName());
        return ApiResponse.ok("Đăng bán sản phẩm thành công, hãy chờ admin duyệt nha");
    }
}