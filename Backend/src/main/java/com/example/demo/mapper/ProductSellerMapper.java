package com.example.demo.mapper;


import com.example.demo.dto.ProductImageSeller;
import com.example.demo.dto.ProductSellerDTO;
import com.example.demo.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductSellerMapper {
    private final ProductImageSellerMapper productImageSellerMapper;

    public ProductSellerDTO toDTO(Product product){

        if(product == null){
            return null;
        }

        List<ProductImageSeller> images =
                product.getHinhAnhs()
                        .stream()
                        .map(productImageSellerMapper::toDTO)
                        .toList();

        return new ProductSellerDTO(
                product.getMaSanPham(),
                product.getTenSanPham(),
                product.getSoLuong(),
                product.getGiaSanPham(),
                product.getThuongHieu(),
                product.getMoTa(),
                product.getMauSac(),
                product.getKichCo(),
                product.getCategory().getTenTheLoai(),
                product.getTinhTrang().getTenTinhTrang(),
                product.getTrangThaiSanPham().getTenTrangThai(),
                product.isActive(),
                product.getSoLuongDaBan(),
                images

        );
    }
}
