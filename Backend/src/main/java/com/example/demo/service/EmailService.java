package com.example.demo.service;

public interface EmailService {
    void guiEmailKichHoat(String toEmail, String maKichHoat);
    void guiEmailQuenMatKhau(String toEmail, String otp);

    // Thêm theo web_tmdt
    void guiEmailTuChoi(String toEmail, String lyDo);
    void guiEmailDonHangMoiChoSeller(String sellerEmail, String tenNguoiMua,
                                      int maDonHang, String diaChi,
                                      double tongTien, String chiTietSanPham);
}
