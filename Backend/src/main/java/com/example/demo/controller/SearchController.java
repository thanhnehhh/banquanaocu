package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.TinhTrangDTO;
import com.example.demo.service.ProductService;
import com.example.demo.service.TinhTrangService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SearchController {

    private final ProductService productService;
    private final TinhTrangService tinhTrangService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer statusId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "maSanPham") String sort,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort.Direction sortDirection = Sort.Direction.valueOf(direction.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<ProductDTO> result = productService.searchProducts(keyword, categoryId, statusId, minPrice, maxPrice, pageable);

        return ApiResponse.ok("Tìm kiếm sản phẩm thành công!", result);
    }

    @GetMapping("/statuses")
    public ResponseEntity<ApiResponse<List<TinhTrangDTO>>> getAllStatuses() {
        List<TinhTrangDTO> statuses = tinhTrangService.getAllStatuses();
        return ApiResponse.ok("Lấy danh sách tình trạng thành công!", statuses);
    }

    @GetMapping("/filter-options")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFilterOptions() {
        Map<String, Object> filterOptions = new HashMap<>();
        filterOptions.put("statuses", tinhTrangService.getAllStatuses());
        return ApiResponse.ok("Lấy tùy chọn lọc thành công!", filterOptions);
    }
}