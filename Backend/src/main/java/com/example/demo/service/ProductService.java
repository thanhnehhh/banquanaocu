package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.ProductForSaleRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    // Luồng Trang chủ & Tìm kiếm
    List<ProductDTO> getNewestProducts(int limit);
    Page<ProductDTO> getBestSellingProducts(Pageable pageable);
    Page<ProductDTO> searchProducts(String keyword, Integer categoryId, Integer statusId,
                                    Double minPrice, Double maxPrice, Pageable pageable);

    // Luồng Chi tiết & Gợi ý
    ProductDTO getProductById(long id);
    List<ProductDTO> getProductsByCategory(int categoryId);
    List<ProductDTO> getProductsBySeller(long sellerId);

    // Luồng Đăng bán
    void postProduct(ProductForSaleRequest request, String email);
}