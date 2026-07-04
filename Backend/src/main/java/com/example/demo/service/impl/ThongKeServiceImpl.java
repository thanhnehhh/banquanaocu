package com.example.demo.service.impl;

import com.example.demo.dao.ThongKeRepository;
import com.example.demo.dto.AdminThongKeDTO;
import com.example.demo.dto.DoanhThuDanhMucDTO;
import com.example.demo.dto.DoanhThuNgayDTO;
import com.example.demo.dto.DoanhThuThangDTO;
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

    @Override
    public AdminThongKeDTO getAdminThongKe(int nam) {
        double tongDoanhThu = thongKeRepository.countTongDoanhThu();
        long tongDonHang    = thongKeRepository.countTongDonHang();
        long tongKhachHang  = thongKeRepository.countTongKhachHang();
        long tongCuaHang    = thongKeRepository.countTongCuaHang();
        List<DoanhThuThangDTO> doanhThuTheoThang =
                thongKeRepository.thongKeDoanhThuNamTheoThang(nam);
        List<DoanhThuDanhMucDTO> doanhThuTheoDanhMuc =
                thongKeRepository.thongKeDoanhThuNamTheoDanhMuc(nam);

        return AdminThongKeDTO.builder()
                .tongDoanhThu(tongDoanhThu)
                .tongDonHang(tongDonHang)
                .tongKhachHang(tongKhachHang)
                .tongCuaHang(tongCuaHang)
                .doanhThuTheoThang(doanhThuTheoThang)
                .doanhThuTheoDanhMuc(doanhThuTheoDanhMuc)
                .build();
    }
}
