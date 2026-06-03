package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.CategoryDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.SellerDTO;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ProductService;
import com.example.demo.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class HomeController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final SellerService sellerService;

    // --- CÁC API TRANG CHỦ (CŨ) ---
    @GetMapping("/hero")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHeroData() {
        Map<String, Object> heroData = new HashMap<>();
        heroData.put("title", "Chào mừng đến cửa hàng trực tuyến");
        heroData.put("description", "Khám phá hàng ngàn sản phẩm chất lượng cao");
        return ApiResponse.ok("Lấy dữ liệu Hero thành công!", heroData);
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategories() {
        return ApiResponse.ok("Lấy danh sách danh mục thành công!", categoryService.getAllCategories());
    }

    @GetMapping("/products/newest")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getNewestProducts(@RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.ok("Lấy sản phẩm mới đăng thành công!", productService.getNewestProducts(limit, null));
    }

    @GetMapping("/products/best-selling")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getBestSellingProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok("Lấy sản phẩm bán chạy nhất thành công!", productService.getBestSellingProducts(pageable, null));
    }

    @GetMapping("/sellers/top-rated")
    public ResponseEntity<ApiResponse<List<SellerDTO>>> getTopRatedSellers(@RequestParam(defaultValue = "8") int limit) {
        return ApiResponse.ok("Lấy danh sách top người bán thành công!", sellerService.getTopRatedSellers(limit));
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByCategory(@PathVariable int categoryId) {
        return ApiResponse.ok("Lấy sản phẩm theo danh mục thành công!", productService.getProductsByCategory(categoryId));
    }

    // --- CÁC API CHI TIẾT VÀ GỢI Ý (MỚI BỔ SUNG) ---
    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductDetail(@PathVariable long id) {
        ProductDTO product = productService.getProductById(id);
        if (product != null) {
            return ApiResponse.ok("Lấy chi tiết sản phẩm thành công!", product);
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại.");
    }

    @GetMapping("/sellers/{id}")
    public ResponseEntity<ApiResponse<SellerDTO>> getSellerDetail(@PathVariable long id) {
        SellerDTO seller = sellerService.getSellerById(id);
        if (seller != null) {
            return ApiResponse.ok("Lấy thông tin người bán thành công!", seller);
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "Người bán không tồn tại.");
    }

    @GetMapping("/sellers/{id}/products")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsBySeller(
            @PathVariable long id,
            @RequestParam(defaultValue = "8") int limit,
            @RequestParam(required = false) Long excludeProductId) {

        List<ProductDTO> products = productService.getProductsBySeller(id);

        if (excludeProductId != null) {
            products = products.stream()
                    .filter(p -> p.getMaSanPham() != excludeProductId)
                    .collect(Collectors.toList());
        }
        if (products.size() > limit) {
            products = products.subList(0, limit);
        }

        return ApiResponse.ok("Lấy sản phẩm của người bán thành công!", products);
    }
}