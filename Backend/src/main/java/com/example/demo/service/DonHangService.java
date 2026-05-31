package com.example.demo.service;

import com.example.demo.dto.DonHangDTO;
import com.example.demo.dto.PageResponse;

import java.util.List;

public interface DonHangService {

    List<DonHangDTO> taoDoHang(String email, String diaChiNhanHang,
                               double chiPhiGiaoHang, String phuongThucThanhToan);

    List<DonHangDTO> getDonHangCuaUser(String email);

    DonHangDTO getDonHangById(String email, int maDonHang);

    DonHangDTO huyDonHang(String email, int maDonHang, String lyDoHuy);

    List<DonHangDTO> getSellOrdersOfSeller(String email, String trangThai);

    DonHangDTO xacNhanDonHang(String sellerEmail, int maDonHang);

    DonHangDTO huyDonHangBySeller(String sellerEmail, int maDonHang, String lyDoHuy);

    PageResponse<DonHangDTO> getAllOrdersForAdmin(String status, int page, int size);

    DonHangDTO adminConfirmOrder(int maDonHang);

    DonHangDTO adminCancelOrder(int maDonHang, String lyDoHuy);
}