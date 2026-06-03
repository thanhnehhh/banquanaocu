package com.example.demo.service.impl;

import com.example.demo.dao.BinhLuanRepository;
import com.example.demo.dao.ProductRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.dto.BinhLuanDTO;
import com.example.demo.dto.TaoBinhLuanRequest;
import com.example.demo.entity.BinhLuan;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.exception.BusinessException;
import com.example.demo.service.BinhLuanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BinhLuanServiceImpl implements BinhLuanService {

    private final BinhLuanRepository binhLuanRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public BinhLuanDTO taoBinhLuan(String email, TaoBinhLuanRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        Product product = productRepository.findById(request.getMaSanPham())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));

        BinhLuan binhLuan = new BinhLuan();
        binhLuan.setNoiDung(request.getNoiDung().trim());
        binhLuan.setProduct(product);
        binhLuan.setUser(user);

        // Nếu là trả lời bình luận
        if (request.getMaBinhLuanCha() != null) {
            BinhLuan cha = binhLuanRepository.findById(request.getMaBinhLuanCha())
                    .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Không tìm thấy bình luận gốc"));

            // Chỉ cho phép trả lời bình luận gốc (không cho reply của reply)
            if (cha.getBinhLuanCha() != null) {
                throw new BusinessException("Chỉ có thể trả lời bình luận gốc");
            }
            binhLuan.setBinhLuanCha(cha);
        }

        binhLuan = binhLuanRepository.save(binhLuan);
        return convertToDTO(binhLuan, false);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BinhLuanDTO> getBinhLuanByProduct(long maSanPham) {
        List<BinhLuan> binhLuanGoc = binhLuanRepository.findBinhLuanGocByProduct(maSanPham);

        return binhLuanGoc.stream()
                .map(bl -> {
                    BinhLuanDTO dto = convertToDTO(bl, false);
                    // Load trả lời cho từng bình luận gốc
                    List<BinhLuanDTO> traLoi = binhLuanRepository
                            .findTraLoiByBinhLuanCha(bl.getMaBinhLuan())
                            .stream()
                            .map(tl -> convertToDTO(tl, false))
                            .collect(Collectors.toList());
                    dto.setTraLoi(traLoi);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void xoaBinhLuan(String email, long maBinhLuan) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        BinhLuan binhLuan = binhLuanRepository.findById(maBinhLuan)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Không tìm thấy bình luận"));

        if (binhLuan.getUser().getMaNguoiDung() != user.getMaNguoiDung()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Bạn không có quyền xóa bình luận này");
        }

        binhLuanRepository.delete(binhLuan);
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private BinhLuanDTO convertToDTO(BinhLuan bl, boolean loadTraLoi) {
        BinhLuanDTO dto = new BinhLuanDTO();
        dto.setMaBinhLuan(bl.getMaBinhLuan());
        dto.setNoiDung(bl.getNoiDung());
        dto.setThoiGianTao(bl.getThoiGianTao());
        dto.setMaBinhLuanCha(bl.getBinhLuanCha() != null ? bl.getBinhLuanCha().getMaBinhLuan() : null);

        User u = bl.getUser();
        dto.setEmailNguoiDung(u.getEmail());
        String ten = ((u.getHoDem() != null ? u.getHoDem() : "")
                + " " + (u.getTen() != null ? u.getTen() : "")).trim();
        dto.setTenNguoiDung(ten.isBlank() ? u.getEmail() : ten);
        dto.setAvatarNguoiDung(u.getAvatar());

        dto.setTraLoi(loadTraLoi ? Collections.emptyList() : null);
        return dto;
    }
}
