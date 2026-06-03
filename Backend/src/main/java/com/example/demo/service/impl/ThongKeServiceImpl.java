package com.example.demo.service.impl;

import com.example.demo.dao.ThongKeRepository;
import com.example.demo.dto.DoanhThuDanhMucDTO;
import com.example.demo.dto.DoanhThuNgayDTO;
import com.example.demo.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThongKeServiceImpl implements ThongKeService {

    private final ThongKeRepository thongKeRepository;

    @Override
    public List<DoanhThuNgayDTO> getDoanhThuTheoThang(int maSeller, int nam, int thang) {
        return thongKeRepository.thongKeDoanhThuTheoThang(maSeller, nam, thang);
    }

    @Override
    public List<DoanhThuDanhMucDTO> getDoanhThuTheoDanhMuc(int maSeller, int thang, int nam) {
        return thongKeRepository.thongKeDoanhThuTheoDanhMuc(maSeller, thang, nam);
    }
}
