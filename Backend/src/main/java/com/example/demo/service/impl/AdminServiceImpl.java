package com.example.demo.service.impl;

import com.example.demo.dao.RoleRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.dto.AdminUserDTO;
import com.example.demo.dto.PageResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminUserDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAllActive(pageable);
        return buildPageResponse(userPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminUserDTO> searchUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.searchActive(keyword, pageable);
        return buildPageResponse(userPage);
    }

    @Override
    public AdminUserDTO updateUserStatus(Long maNguoiDung, Integer trangThai) {
        User user = userRepository.findById(maNguoiDung)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        user.setActive(trangThai == 1);
        return convertToDTO(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long maNguoiDung) {
        if (!userRepository.existsById(maNguoiDung)) {
            throw new RuntimeException("Người dùng không tồn tại");
        }
        userRepository.deleteById(maNguoiDung);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminUserDTO> getAllHiddenUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAllHidden(pageable);
        return buildPageResponse(userPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminUserDTO> searchHiddenUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.searchHidden(keyword, pageable);
        return buildPageResponse(userPage);
    }

    @Override
    public AdminUserDTO createUser(AdminUserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setMatKhau(passwordEncoder.encode(userDTO.getEmail()));
        user.setHoDem(userDTO.getHoDem());
        user.setTen(userDTO.getTen());
        user.setDiaChi(userDTO.getDiaChi());
        if (userDTO.getGioiTinh() != null && !userDTO.getGioiTinh().isEmpty()) {
            user.setGioiTinh(userDTO.getGioiTinh().charAt(0));
        }
        if (userDTO.getNgaySinh() != null && !userDTO.getNgaySinh().isEmpty()) {
            try { user.setBirthDay(LocalDate.parse(userDTO.getNgaySinh())); } catch (Exception ignored) {}
        }
        user.setActive(userDTO.getTrangThai() == null || userDTO.getTrangThai() == 1);
        user.setDaKichHoat(true);

        List<Role> roles = new ArrayList<>();
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            for (String roleName : userDTO.getRoles()) {
                roleRepository.findByTenQuyen(roleName).ifPresent(roles::add);
            }
        }
        if (roles.isEmpty()) {
            roleRepository.findByTenQuyen("ROLE_USER").ifPresent(roles::add);
        }
        user.setRoles(roles);

        return convertToDTO(userRepository.save(user));
    }

    @Override
    public AdminUserDTO updateUser(Long maNguoiDung, AdminUserDTO userDTO) {
        User user = userRepository.findById(maNguoiDung)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        if (userDTO.getHoDem() != null) user.setHoDem(userDTO.getHoDem());
        if (userDTO.getTen() != null) user.setTen(userDTO.getTen());
        if (userDTO.getDiaChi() != null) user.setDiaChi(userDTO.getDiaChi());
        if (userDTO.getGioiTinh() != null && !userDTO.getGioiTinh().isEmpty()) {
            user.setGioiTinh(userDTO.getGioiTinh().charAt(0));
        }
        if (userDTO.getNgaySinh() != null && !userDTO.getNgaySinh().isEmpty()) {
            try { user.setBirthDay(LocalDate.parse(userDTO.getNgaySinh())); } catch (Exception ignored) {}
        }
        if (userDTO.getTrangThai() != null) {
            user.setActive(userDTO.getTrangThai() == 1);
        }
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            List<Role> roles = new ArrayList<>();
            for (String roleName : userDTO.getRoles()) {
                roleRepository.findByTenQuyen(roleName).ifPresent(roles::add);
            }
            if (!roles.isEmpty()) user.setRoles(roles);
        }

        return convertToDTO(userRepository.save(user));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private PageResponse<AdminUserDTO> buildPageResponse(Page<User> userPage) {
        List<AdminUserDTO> content = userPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return PageResponse.<AdminUserDTO>builder()
                .content(content)
                .currentPage(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .build();
    }

    private AdminUserDTO convertToDTO(User user) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setMaNguoiDung(user.getMaNguoiDung());
        dto.setEmail(user.getEmail());
        dto.setHoDem(user.getHoDem());
        dto.setTen(user.getTen());
        dto.setAvatar(user.getAvatar());
        dto.setDiaChi(user.getDiaChi());
        dto.setGioiTinh(user.getGioiTinh() != null ? String.valueOf(user.getGioiTinh()) : null);
        dto.setNgaySinh(user.getBirthDay() != null ? user.getBirthDay().toString() : null);
        dto.setTrangThai(user.isActive() ? 1 : 0);
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(Role::getTenQuyen)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
