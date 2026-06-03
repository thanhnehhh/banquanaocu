package com.example.demo.controller;

import com.example.demo.dto.AdminUserDTO;
import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.DonHangDTO;
import com.example.demo.dto.PageResponse;
import com.example.demo.service.AdminService;
import com.example.demo.service.DonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final DonHangService donHangService;

    /**
     * GET /api/admin/users?page=0&size=10
     * Lấy danh sách người dùng active với phân trang
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<AdminUserDTO> response = adminService.getAllUsers(page, size);
        return ApiResponse.ok("Lấy danh sách người dùng thành công!", response);
    }

    /**
     * GET /api/admin/users/search?q=keyword&page=0&size=10
     * Tìm kiếm người dùng active theo keyword (tên, email)
     */
    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> searchUsers(
            @RequestParam("q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<AdminUserDTO> response = adminService.searchUsers(keyword, page, size);
        return ApiResponse.ok("Tìm kiếm người dùng thành công!", response);
    }

    /**
     * PUT /api/admin/users/{id}/status
     * Cập nhật trạng thái active của người dùng
     * Body: { "trangThai": 1 } (1 = active, 0 = inactive)
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<AdminUserDTO>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        AdminUserDTO response = adminService.updateUserStatus(id, request.getTrangThai());
        return ApiResponse.ok("Cập nhật trạng thái thành công!", response);
    }

    /**
     * DELETE /api/admin/users/{id}
     * Xóa người dùng
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ApiResponse.ok("Xóa người dùng thành công!", null);
    }

    /**
     * GET /api/admin/users/hidden?page=0&size=10
     * Lấy danh sách người dùng bị ẩn (active = false) với phân trang
     */
    @GetMapping("/users/hidden")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> getHiddenUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<AdminUserDTO> response = adminService.getAllHiddenUsers(page, size);
        return ApiResponse.ok("Lấy danh sách người dùng bị ẩn thành công!", response);
    }

    /**
     * GET /api/admin/users/hidden/search?q=keyword&page=0&size=10
     * Tìm kiếm người dùng bị ẩn (active = false) theo keyword
     */
    @GetMapping("/users/hidden/search")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> searchHiddenUsers(
            @RequestParam("q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<AdminUserDTO> response = adminService.searchHiddenUsers(keyword, page, size);
        return ApiResponse.ok("Tìm kiếm người dùng bị ẩn thành công!", response);
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class StatusUpdateRequest {
        private Integer trangThai;
    }

    // ─── Order management (mới thêm theo web_tmdt) ────────────────────────────

    /**
     * GET /api/admin/orders?status=all&page=0&size=10
     */
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<PageResponse<DonHangDTO>>> getAllOrders(
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<DonHangDTO> response = donHangService.getAllOrdersForAdmin(status, page, size);
        return ApiResponse.ok("Lấy danh sách đơn hàng thành công!", response);
    }

    /**
     * PUT /api/admin/orders/{id}/confirm
     */
    @PutMapping("/orders/{id}/confirm")
    public ResponseEntity<ApiResponse<DonHangDTO>> adminConfirmOrder(@PathVariable int id) {
        DonHangDTO donHang = donHangService.adminConfirmOrder(id);
        return ApiResponse.ok("Xác nhận đơn hàng thành công!", donHang);
    }

    /**
     * PUT /api/admin/orders/{id}/cancel
     */
    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<ApiResponse<DonHangDTO>> adminCancelOrder(
            @PathVariable int id,
            @RequestBody Map<String, Object> body) {
        String lyDoHuy = (String) body.getOrDefault("lyDoHuy", "Admin hủy đơn");
        DonHangDTO donHang = donHangService.adminCancelOrder(id, lyDoHuy);
        return ApiResponse.ok("Hủy đơn hàng thành công!", donHang);
    }
}
