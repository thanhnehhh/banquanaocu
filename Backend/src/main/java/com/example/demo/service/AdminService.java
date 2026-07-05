package com.example.demo.service;


import com.example.demo.dto.AdminUserDTO;
import com.example.demo.dto.PageResponse;

public interface AdminService {
    PageResponse<AdminUserDTO> getAllUsers(int page, int size);

    PageResponse<AdminUserDTO> searchUsers(String keyword, int page, int size);

    AdminUserDTO updateUserStatus(Long maNguoiDung, Integer trangThai);

    void deleteUser(Long maNguoiDung);

    PageResponse<AdminUserDTO> getAllHiddenUsers(int page, int size);

    PageResponse<AdminUserDTO> searchHiddenUsers(String keyword, int page, int size);

    // Tạo người dùng mới
    AdminUserDTO createUser(AdminUserDTO userDTO);

    // Cập nhật thông tin người dùng
    AdminUserDTO updateUser(Long maNguoiDung, AdminUserDTO userDTO);
}
