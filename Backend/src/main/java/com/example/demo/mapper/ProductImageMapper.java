package com.example.demo.mapper;

import com.example.demo.dto.ProductImageResponse;
import com.example.demo.entity.HinhAnh;
import org.springframework.stereotype.Component;

@Component
public class ProductImageMapper {

    public ProductImageResponse toDTO(HinhAnh hinhAnh){

        if(hinhAnh == null){
            return null;
        }

        return new ProductImageResponse(
                hinhAnh.getTenHinhAnh(),
                hinhAnh.getDuongDan()
        );
    }
}
