package com.example.demo.mapper;

import com.example.demo.dto.TrangThaiSanPhamDTO;
import com.example.demo.entity.TrangThaiSanPham;
import org.springframework.stereotype.Component;

@Component
public class TrangThaiSanPhamMapper {

    public TrangThaiSanPhamDTO toDT0(TrangThaiSanPham entity) {
        if (entity == null) return null;
        return new TrangThaiSanPhamDTO(entity.getId(), entity.getTenTrangThai());
    }
}
