package com.example.demo.controller;

import com.example.demo.dto.AdminUserDTO;
import com.example.demo.dto.AdminThongKeDTO;
import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.CategoryDTO;
import com.example.demo.dto.DonHangDTO;
import com.example.demo.dto.PageResponse;
import com.example.demo.service.AdminService;
import com.example.demo.service.CategoryService;
import com.example.demo.service.DonHangService;
import com.example.demo.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final DonHangService donHangService;
    private final CategoryService categoryService;
    private final ThongKeService thongKeService;

    // ─── User management ──────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok("Lấy danh sách người dùng thành công!", adminService.getAllUsers(page, size));
    }

    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> searchUsers(
            @RequestParam("q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok("Tìm kiếm người dùng thành công!", adminService.searchUsers(keyword, page, size));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<AdminUserDTO>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ApiResponse.ok("Cập nhật trạng thái thành công!", adminService.updateUserStatus(id, request.getTrangThai()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ApiResponse.ok("Xóa người dùng thành công!", null);
    }

    @GetMapping("/users/hidden")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> getHiddenUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok("Lấy danh sách người dùng bị ẩn thành công!", adminService.getAllHiddenUsers(page, size));
    }

    @GetMapping("/users/hidden/search")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDTO>>> searchHiddenUsers(
            @RequestParam("q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok("Tìm kiếm người dùng bị ẩn thành công!", adminService.searchHiddenUsers(keyword, page, size));
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class StatusUpdateRequest {
        private Integer trangThai;
    }

    // ─── Order management ─────────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<PageResponse<DonHangDTO>>> getAllOrders(
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok("Lấy danh sách đơn hàng thành công!", donHangService.getAllOrdersForAdmin(status, page, size));
    }

    @PutMapping("/orders/{id}/confirm")
    public ResponseEntity<ApiResponse<DonHangDTO>> adminConfirmOrder(@PathVariable int id) {
        return ApiResponse.ok("Xác nhận đơn hàng thành công!", donHangService.adminConfirmOrder(id));
    }

    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<ApiResponse<DonHangDTO>> adminCancelOrder(
            @PathVariable int id,
            @RequestBody Map<String, Object> body) {
        String lyDoHuy = (String) body.getOrDefault("lyDoHuy", "Admin hủy đơn");
        return ApiResponse.ok("Hủy đơn hàng thành công!", donHangService.adminCancelOrder(id, lyDoHuy));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<DonHangDTO>> updateOrderStatus(
            @PathVariable int id,
            @RequestBody Map<String, Object> body) {
        String trangThaiMoi = (String) body.get("trangThai");
        if (trangThaiMoi == null || trangThaiMoi.isBlank()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "Vui lòng nhập trạng thái mới");
        }
        return ApiResponse.ok("Cập nhật trạng thái đơn hàng thành công!", donHangService.updateOrderStatus(id, trangThaiMoi));
    }

    // ─── Category management ──────────────────────────────────────────────────

    /** GET /api/admin/categories?page=0&size=10 */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<PageResponse<CategoryDTO>>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok("Lấy danh sách danh mục thành công!", categoryService.getAllCategories(page, size));
    }

    /** GET /api/admin/categories/search?q=keyword&page=0&size=10 */
    @GetMapping("/categories/search")
    public ResponseEntity<ApiResponse<PageResponse<CategoryDTO>>> searchCategories(
            @RequestParam("q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok("Tìm kiếm danh mục thành công!", categoryService.searchCategories(keyword, page, size));
    }

    /** POST /api/admin/categories */
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@RequestBody CategoryDTO categoryDTO) {
        return ApiResponse.ok("Tạo danh mục thành công!", categoryService.createCategory(categoryDTO));
    }

    /** PUT /api/admin/categories/{id} */
    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable int id,
            @RequestBody CategoryDTO categoryDTO) {
        return ApiResponse.ok("Cập nhật danh mục thành công!", categoryService.updateCategory(id, categoryDTO));
    }

    /** DELETE /api/admin/categories/{id} */
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        return ApiResponse.ok("Xóa danh mục thành công!", null);
    }

    // ─── Admin thống kê ───────────────────────────────────────────────────────

    /** GET /api/admin/thong-ke?nam=2026 */
    @GetMapping("/thong-ke")
    public ResponseEntity<ApiResponse<AdminThongKeDTO>> getAdminThongKe(
            @RequestParam(value = "nam", required = false) Integer nam) {
        if (nam == null) {
            nam = java.time.Year.now().getValue();
        }
        AdminThongKeDTO stats = thongKeService.getAdminThongKe(nam);
        return ApiResponse.ok("Lấy thống kê hệ thống thành công!", stats);
    }
}
