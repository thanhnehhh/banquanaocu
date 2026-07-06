package com.example.demo.service.impl;

import com.example.demo.dao.RoleRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.dto.UserProfileResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.exception.BusinessException;
import com.example.demo.service.EmailService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ... (Giữ nguyên các hàm register, kichHoatTaiKhoan, findByEmail, loadUserByUsername, processOAuthPostLogin)

    @Override
    public void register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Mật khẩu xác nhận không khớp!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email đã được sử dụng!");
        }

        String maKichHoat = UUID.randomUUID().toString();
        User user = new User();
        user.setEmail(request.getEmail());
        user.setMatKhau(passwordEncoder.encode(request.getPassword()));
        user.setDaKichHoat(false);
        user.setActive(true);
        user.setMaKichHoat(maKichHoat);
        user.setThoiGianHetHanMaKichHoat(LocalDateTime.now().plusHours(24));
        user.setNgayDangKy(LocalDateTime.now());

        roleRepository.findByTenQuyen("ROLE_USER").ifPresent(role -> user.setRoles(List.of(role)));
        userRepository.save(user);
        emailService.guiEmailKichHoat(user.getEmail(), maKichHoat);
    }

    @Override
    public boolean kichHoatTaiKhoan(String maKichHoat) {
        Optional<User> optUser = userRepository.findByMaKichHoat(maKichHoat);
        if (optUser.isEmpty()) return false;

        User user = optUser.get();
        if (user.getThoiGianHetHanMaKichHoat() == null || LocalDateTime.now().isAfter(user.getThoiGianHetHanMaKichHoat())) {
            return false;
        }

        user.setDaKichHoat(true);
        user.setMaKichHoat(null);
        user.setThoiGianHetHanMaKichHoat(null);
        userRepository.save(user);
        return true;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        if (!user.isDaKichHoat()) throw new BusinessException("Tài khoản chưa được kích hoạt");
        if (!user.isActive()) throw new BusinessException("Tài khoản đã bị khóa");

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getTenQuyen()))
                .toList();

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getMatKhau(), authorities);
    }

    @Override
    public void processOAuthPostLogin(String email, String name, String avatar, String googleId) {
        Optional<User> existUser = userRepository.findByEmail(email);
        if (existUser.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setMatKhau(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setTen(name);
            newUser.setAvatar(avatar);
            newUser.setGoogleId(googleId);
            newUser.setDaKichHoat(true);
            newUser.setActive(true);
            newUser.setNgayDangKy(LocalDateTime.now());

            roleRepository.findByTenQuyen("ROLE_USER").ifPresent(role -> newUser.setRoles(List.of(role)));
            userRepository.save(newUser);
        } else {
            // Cập nhật thông tin nếu user đã tồn tại nhưng thiếu dữ liệu Google
            User user = existUser.get();
            boolean needUpdate = false;

            // Tài khoản đăng nhập Google luôn được coi là đã kích hoạt
            if (!user.isDaKichHoat()) {
                user.setDaKichHoat(true);
                needUpdate = true;
            }

            if (avatar != null && !avatar.isEmpty()
                    && (user.getAvatar() == null || user.getAvatar().isEmpty())) {
                user.setAvatar(avatar);
                needUpdate = true;
            }
            if (googleId != null && !googleId.isEmpty()
                    && (user.getGoogleId() == null || user.getGoogleId().isEmpty())) {
                user.setGoogleId(googleId);
                needUpdate = true;
            }
            if (name != null && !name.isEmpty()
                    && (user.getTen() == null || user.getTen().isEmpty())) {
                user.setTen(name);
                needUpdate = true;
            }

            if (needUpdate) {
                userRepository.save(user);
            }
        }
    }

    // ==========================================
    // CHỨC NĂNG QUÊN MẬT KHẨU
    // ==========================================

    @Override
    public void quenMatKhau(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng với email: " + email));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setMaKichHoat(otp);
        user.setThoiGianHetHanMaKichHoat(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.guiEmailQuenMatKhau(email, otp);
    }

    @Override
    public boolean xacNhanOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng với email: " + email));

        if (user.getMaKichHoat() == null || !user.getMaKichHoat().equals(otp)) return false;
        if (user.getThoiGianHetHanMaKichHoat() == null || LocalDateTime.now().isAfter(user.getThoiGianHetHanMaKichHoat())) return false;

        return true;
    }

    @Override
    public void datLaiMatKhau(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Mật khẩu xác nhận không khớp!");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng với email: " + request.getEmail()));

        if (user.getMaKichHoat() == null || !user.getMaKichHoat().equals(request.getOtp())) {
            throw new BusinessException("Mã OTP không hợp lệ!");
        }

        if (user.getThoiGianHetHanMaKichHoat() == null || LocalDateTime.now().isAfter(user.getThoiGianHetHanMaKichHoat())) {
            throw new BusinessException("Mã OTP đã hết hạn!");
        }

        user.setMatKhau(passwordEncoder.encode(request.getNewPassword()));
        user.setMaKichHoat(null);
        user.setThoiGianHetHanMaKichHoat(null);
        userRepository.save(user);
    }

    // ==========================================
    // CHỨC NĂNG HỒ SƠ CÁ NHÂN
    // ==========================================

    @Override
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng với email: " + email));
        return mapToProfileResponse(user);
    }

    @Override
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng với email: " + email));

        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        if (request.getHoDem() != null) user.setHoDem(request.getHoDem());
        if (request.getTen() != null) user.setTen(request.getTen());
        if (request.getBirthDay() != null) user.setBirthDay(request.getBirthDay());
        if (request.getGioiTinh() != null) user.setGioiTinh(request.getGioiTinh());
        if (request.getDiaChi() != null) user.setDiaChi(request.getDiaChi());
        if (request.getSoDienThoai() != null) user.setSoDienThoai(request.getSoDienThoai());
        if (request.getHobby() != null) user.setHobby(request.getHobby());

        userRepository.save(user);
        return mapToProfileResponse(user);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        UserProfileResponse res = new UserProfileResponse();
        res.setMaNguoiDung(user.getMaNguoiDung());
        res.setEmail(user.getEmail());
        res.setHoDem(user.getHoDem());
        res.setTen(user.getTen());
        res.setSoDienThoai(user.getSoDienThoai());
        res.setDiaChi(user.getDiaChi());
        res.setGioiTinh(user.getGioiTinh());
        res.setAvatar(user.getAvatar());
        res.setHobby(user.getHobby());
        res.setGoogleId(user.getGoogleId());
        res.setBirthDay(user.getBirthDay());
        res.setNgayDangKy(user.getNgayDangKy());
        res.setThoiGianChinhSua(user.getThoiGianChinhSua());
        return res;
    }
}