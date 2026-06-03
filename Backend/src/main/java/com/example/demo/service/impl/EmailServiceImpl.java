package com.example.demo.service.impl;

import com.example.demo.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Async
    @Override
    public void guiEmailKichHoat(String toEmail, String maKichHoat) {
        String linkKichHoat = "http://localhost:5173/kich-hoat/" + maKichHoat;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Kích hoạt tài khoản của bạn");
        message.setText(
                "Chào bạn,\n\n" +
                "Cảm ơn bạn đã đăng ký tài khoản.\n" +
                "Vui lòng nhấn vào đường dẫn bên dưới để kích hoạt tài khoản:\n\n" +
                linkKichHoat + "\n\n" +
                "Đường dẫn có hiệu lực trong 24 giờ.\n\n" +
                "Trân trọng,\nWeb TMĐT Team"
        );
        mailSender.send(message);
    }

    @Async
    @Override
    public void guiEmailQuenMatKhau(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Yêu cầu đặt lại mật khẩu");
        message.setText(
                "Chào bạn,\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n" +
                "Mã xác nhận (OTP) của bạn là: " + otp + "\n\n" +
                "Mã này có hiệu lực trong 24 giờ.\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\nWeb TMĐT Team"
        );
        mailSender.send(message);
    }

    @Async
    @Override
    public void guiEmailTuChoi(String toEmail, String lyDo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Sản phẩm của bạn đã bị từ chối");
        message.setText(
                "Chào bạn,\n\n" +
                "Sản phẩm bạn đăng bán vừa bị từ chối.\n" +
                "Lý do: " + lyDo + "\n\n" +
                "Vui lòng chỉnh sửa và đăng lại.\n\n" +
                "Trân trọng,\nWeb TMĐT Team"
        );
        mailSender.send(message);
    }

    @Async
    @Override
    public void guiEmailDonHangMoiChoSeller(String sellerEmail, String tenNguoiMua,
                                             int maDonHang, String diaChi,
                                             double tongTien, String chiTietSanPham) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(sellerEmail);
        message.setSubject("Bạn có đơn hàng mới #" + maDonHang);
        message.setText(
                "Chào bạn,\n\n" +
                "Bạn vừa nhận được đơn hàng mới!\n\n" +
                "Mã đơn hàng: #" + maDonHang + "\n" +
                "Người mua: " + tenNguoiMua + "\n" +
                "Địa chỉ giao hàng: " + diaChi + "\n" +
                "Tổng tiền: " + String.format("%,.0f", tongTien) + " VND\n\n" +
                "Sản phẩm:\n" + chiTietSanPham + "\n" +
                "Vui lòng vào hệ thống để xác nhận đơn hàng.\n\n" +
                "Trân trọng,\nWeb TMĐT Team"
        );
        mailSender.send(message);
    }
}
