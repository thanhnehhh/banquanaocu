package com.example.demo.service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.dto.UserProfileResponse;
import com.example.demo.entity.User;
import com.example.demo.dto.ResetPasswordRequest;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    void register(RegisterRequest request);

    boolean kichHoatTaiKhoan(String maKichHoat);

    Optional<User> findByEmail(String email);

    void quenMatKhau(String email);

    boolean xacNhanOtp(String email, String otp);

    void datLaiMatKhau(ResetPasswordRequest request);

    void processOAuthPostLogin(String email, String name, String avatar, String googleId);

    UserProfileResponse getProfile(String email);

    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);
}