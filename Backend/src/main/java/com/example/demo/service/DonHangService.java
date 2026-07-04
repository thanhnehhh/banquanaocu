package com.example.demo.service;

import com.example.demo.dto.DonHangDTO;
import com.example.demo.dto.PageResponse;

import java.util.List;

public interface DonHangService {

    /** Tạo đơn hàng — chia theo từng seller, trả về danh sách đơn con */
    List<DonHangDTO> taoDoHang(String email, String diaChiNhanHang,
                                double chiPhiGiaoHang, String phuongThucThanhToan);

    /** Lấy danh sách đơn hàng của user (người mua) */
    List<DonHangDTO> getDonHangCuaUser(String email);

    /** Lấy chi tiết một đơn hàng */
    DonHangDTO getDonHangById(String email, int maDonHang);

    /** Người mua hủy đơn hàng */
    DonHangDTO huyDonHang(String email, int maDonHang, String lyDoHuy);

    /** Admin: Cập nhật trạng thái đơn hàng sang trạng thái bất kỳ */
    DonHangDTO updateOrderStatus(int maDonHang, String trangThaiMoi);

    /** Hoàn thành đơn hàng (legacy — giữ lại để không phá code cũ) */
    DonHangDTO hoanThanhDonHang(String email, int maDonHang);

    // ─── Seller ───────────────────────────────────────────────────────────────

    /** Lấy danh sách đơn bán của seller, lọc theo trangThai ("all" = tất cả) */
    List<DonHangDTO> getSellOrdersOfSeller(String email, String trangThai);

    /** Seller xác nhận đơn hàng → "Đã duyệt" */
    DonHangDTO xacNhanDonHang(String sellerEmail, int maDonHang);

    /** Seller hủy đơn hàng */
    DonHangDTO huyDonHangBySeller(String sellerEmail, int maDonHang, String lyDoHuy);

    // ─── Admin ────────────────────────────────────────────────────────────────

    /** Admin lấy tất cả đơn hàng có phân trang và filter trạng thái */
    PageResponse<DonHangDTO> getAllOrdersForAdmin(String status, int page, int size);

    /** Admin xác nhận đơn hàng → "Đã duyệt" */
    DonHangDTO adminConfirmOrder(int maDonHang);

    /** Admin hủy đơn hàng */
    DonHangDTO adminCancelOrder(int maDonHang, String lyDoHuy);
}
