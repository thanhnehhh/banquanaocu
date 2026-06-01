package com.example.demo.service.impl;

import com.example.demo.dto.DonHangDTO;

import java.util.List;

public interface DonHangService {

    /** Tạo đơn hàng từ giỏ hàng hiện tại của user */
    DonHangDTO taoDoHang(String email, String diaChiNhanHang, double chiPhiGiaoHang);

    /** Lấy danh sách đơn hàng của user */
    List<DonHangDTO> getDonHangCuaUser(String email);

    /** Lấy chi tiết một đơn hàng */
    DonHangDTO getDonHangById(String email, int maDonHang);

    /** Hủy đơn hàng (chỉ được hủy khi đang "Chờ xác nhận") */
    DonHangDTO huyDonHang(String email, int maDonHang, String lyDoHuy);

    DonHangDTO hoanThanhDonHang(String email, int maDonHang);
}
