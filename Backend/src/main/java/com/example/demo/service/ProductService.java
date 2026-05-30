package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getNewestProducts(int limit);
    Page<ProductDTO> getBestSellingProducts(Pageable pageable);
    ProductDTO getProductById(long id);
    List<ProductDTO> getProductsByCategory(int categoryId);
    List<ProductDTO> getProductsBySeller(long sellerId);
    Page<ProductDTO> searchProducts(String keyword, Integer categoryId, Integer statusId,
                                    Double minPrice, Double maxPrice, Pageable pageable);
}