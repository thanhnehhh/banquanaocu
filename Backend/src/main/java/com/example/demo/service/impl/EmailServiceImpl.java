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
        message.setText("Chào bạn,\n\nCảm ơn bạn đã đăng ký tài khoản.\n" +
                "Vui lòng nhấn vào đường dẫn bên dưới để kích hoạt tài khoản:\n\n" + linkKichHoat +
                "\n\nĐường dẫn có hiệu lực trong 24 giờ.\n\nTrân trọng,\nĐội ngũ phát triển");
        mailSender.send(message);
    }

    @Async
    @Override
    public void guiEmailQuenMatKhau(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Yêu cầu đặt lại mật khẩu");
        message.setText("Chào bạn,\n\nBạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n" +
                "Mã xác nhận (OTP) của bạn là: " + otp + "\n\nMã này có hiệu lực trong 24 giờ.\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\nTrân trọng.");
        mailSender.send(message);
    }
}