package com.example.demo.mapper;


import com.example.demo.dto.ProductImageSeller;
import com.example.demo.entity.HinhAnh;
import org.springframework.stereotype.Component;

@Component
public class ProductImageSellerMapper {

    public ProductImageSeller toDTO(HinhAnh hinhAnh) {
        if(hinhAnh == null){
            return null;
        }

        return new ProductImageSeller(
                hinhAnh.getMaHinhAnh(),
                hinhAnh.getTenHinhAnh(),
                hinhAnh.getDuongDan()
        );
    }

}
