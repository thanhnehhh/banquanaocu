package com.example.demo.service.impl;

import com.example.demo.dao.*;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.exception.BusinessException;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final HinhAnhRepository hinhAnhRepository;
    private final CategoryRepository categoryRepository;
    private final TinhTrangRepository tinhTrangRepository;
    private final TrangThaiSanPhamRepository trangThaiSanPhamRepository;

    @Override
    public List<ProductDTO> getNewestProducts(int limit) {
        return productRepository.findAll().stream()
                .sorted((p1, p2) -> Long.compare(p2.getMaSanPham(), p1.getMaSanPham()))
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDTO> getBestSellingProducts(Pageable pageable) {
        return productRepository.findAllByOrderBySoLuongDaBanDesc(pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<ProductDTO> searchProducts(String keyword, Integer categoryId, Integer statusId,
                                           Double minPrice, Double maxPrice, Pageable pageable) {
        return productRepository.searchProducts(keyword, categoryId, statusId, minPrice, maxPrice, pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(this::convertToDTO).orElse(null);
    }

    @Override
    public List<ProductDTO> getProductsByCategory(int categoryId) {
        return productRepository.findByCategoryMaTheLoai(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsBySeller(long sellerId) {
        return productRepository.findByUserMaNguoiDung(sellerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void postProduct(ProductForSaleRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại"));

        TinhTrang tinhTrang = tinhTrangRepository.findById(request.getTinhTrangId())
                .orElseThrow(() -> new BusinessException("Tình trạng sản phẩm không tồn tại"));

        TrangThaiSanPham trangThai = trangThaiSanPhamRepository.findByTenTrangThai("PENDING");
        if (trangThai == null) {
            throw new BusinessException("Không tìm thấy trạng thái PENDING trong hệ thống");
        }

        Product product = new Product();
        product.setTenSanPham(request.getTenSanPham());
        product.setSoLuong(request.getSoLuong());
        product.setGiaSanPham(request.getGiaBan());
        product.setMoTa(request.getMoTa());
        product.setMauSac(request.getMauSac());
        product.setKichCo(request.getKichThuoc());
        product.setThuongHieu(request.getThuongHieu());
        product.setActive(true);
        product.setSoLuongDaBan(0);

        product.setUser(user);
        product.setCategory(category);
        product.setTinhTrang(tinhTrang);
        product.setTrangThaiSanPham(trangThai);

        Product savedProduct = productRepository.save(product);

        List<HinhAnh> images = request.getImages().stream().map(imgRequest -> {
            HinhAnh image = new HinhAnh();
            image.setTenHinhAnh(imgRequest.getTenAnh());
            image.setDuongDan(imgRequest.getDuongDan());
            image.setProduct(savedProduct);
            return image;
        }).collect(Collectors.toList());

        hinhAnhRepository.saveAll(images);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setMaSanPham(product.getMaSanPham());
        dto.setTenSanPham(product.getTenSanPham());
        dto.setGiaSanPham(product.getGiaSanPham());
        dto.setSoLuong(product.getSoLuong());

        if (product.getUser() != null) {
            dto.setTenNguoiBan(product.getUser().getTen());
            dto.setMaNguoiBan(product.getUser().getMaNguoiDung());
            dto.setEmail(product.getUser().getEmail());
            dto.setHinhAnhDaiDien(product.getUser().getAvatar());
        }

        if (product.getCategory() != null) {
            dto.setTenTheLoai(product.getCategory().getTenTheLoai());
            dto.setMaTheLoai(product.getCategory().getMaTheLoai());
        }

        if (product.getTinhTrang() != null) {
            dto.setMaTinhTrang(product.getTinhTrang().getMaTinhTrang());
            dto.setTenTinhTrang(product.getTinhTrang().getTenTinhTrang());
        }

        // Map Hình ảnh
        if (product.getHinhAnhs() != null && !product.getHinhAnhs().isEmpty()) {
            List<String> hinhAnhs = product.getHinhAnhs().stream()
                    .map(HinhAnh::getDuongDan)
                    .collect(Collectors.toList());
            dto.setHinhAnhs(hinhAnhs);
            dto.setHinhAnhDaiDien(hinhAnhs.get(0)); // Lấy ảnh đầu làm avatar sản phẩm
        } else {
            dto.setHinhAnhs(Collections.emptyList());
        }

        // Map Đánh giá
        if (product.getReviews() != null && !product.getReviews().isEmpty()) {
            dto.setSoLuongDanhGia(product.getReviews().size());

            double avg = product.getReviews().stream()
                    .mapToDouble(Review::getDiemXepHang)
                    .average()
                    .orElse(0.0);
            dto.setDanhGia(avg);

            List<ReviewDTO> reviewDTOs = product.getReviews().stream().map(r -> {
                ReviewDTO rdto = new ReviewDTO();
                rdto.setMaDanhGia(r.getMaDanhGia());
                rdto.setDiemXepHang(r.getDiemXepHang());
                rdto.setNhanXet(r.getNhanXet());
                if(r.getUser() != null) {
                    rdto.setEmailNguoiDung(r.getUser().getEmail());
                    rdto.setTenNguoiDung(r.getUser().getTen());
                    rdto.setAvatarNguoiDung(r.getUser().getAvatar());
                }
                return rdto;
            }).collect(Collectors.toList());
            dto.setDanhGias(reviewDTOs);
        } else {
            dto.setSoLuongDanhGia(0);
            dto.setDanhGia(0.0);
            dto.setDanhGias(Collections.emptyList());
        }

        return dto;
    }
}