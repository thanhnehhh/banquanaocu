package com.example.demo.service.impl;

import com.example.demo.dao.TrangThaiSanPhamRepository;
import com.example.demo.dto.TrangThaiSanPhamDTO;
import com.example.demo.entity.TrangThaiSanPham;
import com.example.demo.mapper.TrangThaiSanPhamMapper;
import com.example.demo.service.TrangThaiSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrangThaiSanPhamServiceImpl implements TrangThaiSanPhamService {

    private final TrangThaiSanPhamRepository trangThaiSanPhamRepository;
    private final TrangThaiSanPhamMapper trangThaiSanPhamMapper;

    @Override
    public List<TrangThaiSanPhamDTO> getAll() {
        List<TrangThaiSanPham> result = trangThaiSanPhamRepository.findAll();
        return result.stream()
                .map(trangThaiSanPhamMapper::toDT0)
                .toList();
    }
}
