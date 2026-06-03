package com.example.demo.controller;

import com.example.demo.dao.GiaoDichRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.entity.GiaoDich;
import com.example.demo.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vi")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ViController {

    private final UserRepository userRepository;
    private final GiaoDichRepository giaoDichRepository;

    /**
     * GET /api/vi/{maNguoiDung}
     * Lấy số dư và lịch sử giao dịch của ví
     */
    @GetMapping("/{maNguoiDung}")
    public ResponseEntity<?> layThongTinVi(@PathVariable Long maNguoiDung) {
        Optional<User> userOpt = userRepository.findById(maNguoiDung);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy user");

        User user = userOpt.get();
        List<GiaoDich> lichSu = giaoDichRepository.findByUser_MaNguoiDungOrderByNgayTaoDesc(maNguoiDung);

        Map<String, Object> response = new HashMap<>();
        response.put("soDu", user.getSoDu() != null ? user.getSoDu() : 0.0);
        response.put("lichSu", lichSu);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/vi/{maNguoiDung}/rut-tien
     * Thực hiện rút tiền từ ví
     */
    @PostMapping("/{maNguoiDung}/rut-tien")
    public ResponseEntity<?> rutTien(@PathVariable Long maNguoiDung, @RequestParam Double soTien) {
        Optional<User> userOpt = userRepository.findById(maNguoiDung);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy user");

        User user = userOpt.get();
        Double soDuHienTai = user.getSoDu() != null ? user.getSoDu() : 0.0;

        if (soTien < 50000) return ResponseEntity.badRequest().body("Số tiền rút tối thiểu là 50.000đ");
        if (soTien > soDuHienTai) return ResponseEntity.badRequest().body("Số dư không đủ");

        // Trừ tiền
        user.setSoDu(soDuHienTai - soTien);
        userRepository.save(user);

        // Lưu lịch sử giao dịch
        GiaoDich gd = new GiaoDich();
        gd.setUser(user);
        gd.setSoTien(soTien);
        gd.setLoaiGiaoDich("outflow");
        gd.setMoTa("Rút tiền về ngân hàng");
        gd.setTrangThai("Thành công");
        giaoDichRepository.save(gd);

        return ResponseEntity.ok("Rút tiền thành công");
    }
}
