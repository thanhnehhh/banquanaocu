package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.JwtAuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.dto.VerifyOtpRequest;
import com.example.demo.service.JWTService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    @PostMapping("/dang-ky")
    public ResponseEntity<ApiResponse<Void>> dangKy(@Validated @RequestBody RegisterRequest request) {
        userService.register(request);
        return ApiResponse.ok("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.");
    }

    @PostMapping("/dang-nhap")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> dangNhap(@Validated @RequestBody LoginRequest request,
                                                                 HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(request.getEmail());
            String refreshToken = jwtService.createRefreshToken(request.getEmail());

            Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);

            return ApiResponse.ok("Đăng nhập thành công!", new JwtAuthResponse(token));
        } else {
            return ApiResponse.error(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng.");
        }
    }

    @GetMapping("/kich-hoat")
    public ResponseEntity<ApiResponse<Void>> kichHoat(@RequestParam("ma") String maKichHoat) {
        boolean thanhCong = userService.kichHoatTaiKhoan(maKichHoat);

        if (thanhCong) {
            return ApiResponse.ok("Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.");
        } else {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "Mã kích hoạt không hợp lệ hoặc đã hết hạn.");
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ApiResponse.error(HttpStatus.UNAUTHORIZED, "Không tìm thấy refresh token trong cookie.");
        }

        try {
            String email = jwtService.extractEmail(refreshToken);
            org.springframework.security.core.userdetails.UserDetails userDetails = userService
                    .loadUserByUsername(email);

            if (jwtService.validateToken(refreshToken, userDetails)) {
                String newToken = jwtService.generateToken(email);
                String newRefreshToken = jwtService.createRefreshToken(email);

                Cookie cookie = new Cookie("refreshToken", newRefreshToken);
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setMaxAge(7 * 24 * 60 * 60);
                response.addCookie(cookie);

                return ApiResponse.ok("Làm mới token thành công!", new JwtAuthResponse(newToken));
            } else {
                return ApiResponse.error(HttpStatus.UNAUTHORIZED, "Refresh token không hợp lệ hoặc đã hết hạn.");
            }
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.UNAUTHORIZED, "Refresh token không hợp lệ hoặc đã hết hạn.");
        }
    }

    @PostMapping("/dang-xuat")
    public ResponseEntity<ApiResponse<Void>> dangXuat(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken != null && !refreshToken.trim().isEmpty()) {
            Cookie cookie = new Cookie("refreshToken", "");
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }

        return ApiResponse.ok("Đăng xuất thành công!");
    }

    @PostMapping("/quen-mat-khau")
    public ResponseEntity<ApiResponse<Void>> quenMatKhau(@Validated @RequestBody ForgotPasswordRequest request) {
        userService.quenMatKhau(request.getEmail());
        return ApiResponse.ok("Mã xác nhận (OTP) đã được gửi đến email của bạn.");
    }

    @PostMapping("/xac-nhan-otp")
    public ResponseEntity<ApiResponse<Void>> xacNhanOtp(@Validated @RequestBody VerifyOtpRequest request) {
        boolean hopLe = userService.xacNhanOtp(request.getEmail(), request.getOtp());
        if (hopLe) {
            return ApiResponse.ok("Mã OTP hợp lệ.");
        } else {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "Mã OTP không hợp lệ hoặc đã hết hạn.");
        }
    }

    @PostMapping("/dat-lai-mat-khau")
    public ResponseEntity<ApiResponse<Void>> datLaiMatKhau(@Validated @RequestBody ResetPasswordRequest request) {
        userService.datLaiMatKhau(request);
        return ApiResponse.ok("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.");
    }
}