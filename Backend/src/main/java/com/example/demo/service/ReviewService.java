package com.example.demo.service;


import com.example.demo.dto.ReviewDTO;
import com.example.demo.dto.TaoReviewRequest;

public interface ReviewService {

    // Tạo đánh giá sản phẩm (user phải đã mua sản phẩm đó)
    ReviewDTO taoReview(String email, TaoReviewRequest request);

    // Kiểm tra user đã đánh giá sản phẩm này chưa
    boolean daDanhGia(String email, long maSanPham);

    // Kiểm tra user có thể đánh giá không (đã mua + đơn thành công)
    boolean coTheDanhGia(String email, long maSanPham);
}
