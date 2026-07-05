package com.example.demo.service;

import com.example.demo.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    // Lấy danh sách sản phẩm mới nhất,
    // loại trừ sản phẩm của người bán đang đăng nhập (null = không loại trừ)
    List<ProductDTO> getNewestProducts(int limit, String excludeEmail);

    // Lấy danh sách sản phẩm bán chạy nhất,
    // loại trừ sản phẩm của người bán đang đăng nhập (null = không loại trừ)
    Page<ProductDTO> getBestSellingProducts(Pageable pageable, String excludeEmail);

    ProductDTO getProductById(long id);

    List<ProductDTO> getProductsByCategory(int categoryId);

    List<ProductDTO> getProductsBySeller(long sellerId);

    // Tìm kiếm sản phẩm với bộ lọc kết hợp
    Page<ProductDTO> searchProducts(String keyword, Integer categoryId, Integer statusId,
                                    Double minPrice, Double maxPrice, Pageable pageable);

    void postProduct(ProductForSaleRequest request, String email);

    void approveProduct(Long id);

    void rejectProduct(Long id, RejectProductRequest request);

    Page<ProductPendingDTO> getPendingProducts(Pageable pageable);

    // Lấy sản phẩm của seller với filter (ALL / ACTIVE / PENDING / SOLD_OUT / DEACTIVE / REJECTED)
    Page<ProductSellerDTO> getProductsByUser(String email, SellerListingFilter filter, Pageable pageable);

    void activeProduct(Long id, String email, boolean isAdmin);

    void deactiveProduct(Long id, String email, boolean isAdmin);

    void updateProduct(Long productId, ProductUpdateRequest request, String email, boolean isAdmin);

    // Lấy chi tiết 1 sản phẩm để quản lý (seller hoặc admin)
    ProductSellerDTO getProductForManagement(long productId, boolean isAdmin);

    // Lấy tất cả sản phẩm cho admin với filter
    Page<ProductAdminDTO> getProductsForAdmin(Pageable pageable, SellerListingFilter filter);

    // Tìm kiếm sản phẩm theo hình ảnh với mức tương đồng tối thiểu
    List<ProductDTO> searchByImage(org.springframework.web.multipart.MultipartFile imageFile,
                                   Double threshold, Long currentUserId);
}
