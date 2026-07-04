package com.example.demo.service.impl;

import com.example.demo.dao.DonHangRepository;
import com.example.demo.dao.ProductRepository;
import com.example.demo.dao.ReviewRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.dto.ReviewDTO;
import com.example.demo.dto.TaoReviewRequest;
import com.example.demo.entity.DonHang;
import com.example.demo.entity.Product;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final DonHangRepository donHangRepository;

    @Override
    @Transactional
    public ReviewDTO taoReview(String email, TaoReviewRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Product product = productRepository.findById(request.getMaSanPham())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Kiểm tra user đã mua sản phẩm này chưa (có đơn hàng "Hoàn thành" chứa sản phẩm)
        List<DonHang> donHangs = donHangRepository
                .findByUserMaNguoiDungOrderByNgayTaoDesc(user.getMaNguoiDung());

        boolean daMua = donHangs.stream()
                .filter(dh -> dh.getTrangThaiDonHang() != null
                        && ("Đã duyệt".equals(dh.getTrangThaiDonHang().getTenTrangThai())
                        || "Đã thanh toán".equals(dh.getTrangThaiDonHang().getTenTrangThai())))
                .flatMap(dh -> dh.getChiTietDonHangs().stream())
                .anyMatch(ct -> ct.getProduct().getMaSanPham().equals(request.getMaSanPham()));

        if (!daMua) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá sản phẩm đã mua và đơn hàng đã hoàn thành");
        }

        // Kiểm tra đã đánh giá chưa
        if (reviewRepository.existsByProductMaSanPhamAndUserMaNguoiDung(
                request.getMaSanPham(), user.getMaNguoiDung())) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi");
        }

        // Validate điểm
        if (request.getDiemXepHang() < 1 || request.getDiemXepHang() > 5) {
            throw new RuntimeException("Điểm đánh giá phải từ 1 đến 5");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setDiemXepHang(request.getDiemXepHang());
        review.setNhanXet(request.getNhanXet());
        review = reviewRepository.save(review);

        // Map sang DTO
        ReviewDTO dto = new ReviewDTO();
        dto.setMaDanhGia(review.getMaDanhGia());
        dto.setDiemXepHang(review.getDiemXepHang());
        dto.setNhanXet(review.getNhanXet());
        dto.setEmailNguoiDung(user.getEmail());
        String ten = (user.getHoDem() != null ? user.getHoDem() : "")
                + " " + (user.getTen() != null ? user.getTen() : "");
        dto.setTenNguoiDung(ten.trim());
        dto.setAvatarNguoiDung(user.getAvatar());
        return dto;
    }

    @Override
    public boolean daDanhGia(String email, long maSanPham) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return reviewRepository.existsByProductMaSanPhamAndUserMaNguoiDung(
                maSanPham, user.getMaNguoiDung());
    }

    @Override
    public boolean coTheDanhGia(String email, long maSanPham) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<DonHang> donHangs = donHangRepository
                .findByUserMaNguoiDungOrderByNgayTaoDesc(user.getMaNguoiDung());

        return donHangs.stream()
                .filter(dh -> dh.getTrangThaiDonHang() != null
                        && ("Thành công".equals(dh.getTrangThaiDonHang().getTenTrangThai())
                        || "Đã duyệt".equals(dh.getTrangThaiDonHang().getTenTrangThai())))
                .flatMap(dh -> dh.getChiTietDonHangs().stream())
                .anyMatch(ct -> ct.getProduct().getMaSanPham().equals(maSanPham));
    }
}
