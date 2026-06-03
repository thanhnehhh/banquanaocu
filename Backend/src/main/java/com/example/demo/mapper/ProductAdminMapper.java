package com.example.demo.mapper;

import com.example.demo.dto.ProductAdminDTO;
import com.example.demo.dto.ProductImageResponse;
import com.example.demo.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductAdminMapper {

    private final ProductImageMapper productImageMapper;

    public ProductAdminDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductImageResponse images =
                product.getHinhAnhs() == null || product.getHinhAnhs().isEmpty()
                        ? new ProductImageResponse()
                        : productImageMapper.toDTO(product.getHinhAnhs().get(0));

        return new ProductAdminDTO(
                product.getMaSanPham(),
                product.getTenSanPham(),
                product.getSoLuong(),
                product.getGiaSanPham(),
                product.getUser().getEmail(),
                product.getTrangThaiSanPham().getTenTrangThai(),
                product.isActive(),
                images
        );
    }
}
