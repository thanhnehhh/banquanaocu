package com.example.demo.service;

import com.example.demo.dao.TinhTrangRepository;
import com.example.demo.dto.TinhTrangDTO;
import com.example.demo.entity.TinhTrang;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TinhTrangService {

    private final TinhTrangRepository tinhTrangRepository;

    public List<TinhTrangDTO> getAllStatuses() {
        return tinhTrangRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TinhTrangDTO getStatusById(int maTinhTrang) {
        TinhTrang tinhTrang = tinhTrangRepository.findById(maTinhTrang)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tình trạng với ID: " + maTinhTrang));
        return convertToDTO(tinhTrang);
    }

    public TinhTrangDTO getStatusByName(String tenTinhTrang) {
        TinhTrang tinhTrang = tinhTrangRepository.findByTenTinhTrang(tenTinhTrang);
        if (tinhTrang == null) {
            throw new RuntimeException("Không tìm thấy tình trạng: " + tenTinhTrang);
        }
        return convertToDTO(tinhTrang);
    }

    // ─── Các method mới thêm (theo web_tmdt) ──────────────────────────────────

    public TinhTrangDTO createStatus(TinhTrangDTO dto) {
        TinhTrang tinhTrang = new TinhTrang();
        tinhTrang.setTenTinhTrang(dto.getTenTinhTrang());
        tinhTrang.setMoTa(dto.getMoTa());
        TinhTrang saved = tinhTrangRepository.save(tinhTrang);
        return convertToDTO(saved);
    }

    public TinhTrangDTO updateStatus(int id, TinhTrangDTO dto) {
        TinhTrang tinhTrang = tinhTrangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tình trạng với ID: " + id));
        if (dto.getTenTinhTrang() != null) {
            tinhTrang.setTenTinhTrang(dto.getTenTinhTrang());
        }
        if (dto.getMoTa() != null) {
            tinhTrang.setMoTa(dto.getMoTa());
        }
        TinhTrang saved = tinhTrangRepository.save(tinhTrang);
        return convertToDTO(saved);
    }

    public void deleteStatus(int id) {
        tinhTrangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tình trạng với ID: " + id));
        tinhTrangRepository.deleteById(id);
    }

    private TinhTrangDTO convertToDTO(TinhTrang tinhTrang) {
        TinhTrangDTO dto = new TinhTrangDTO();
        dto.setMaTinhTrang(tinhTrang.getMaTinhTrang());
        dto.setTenTinhTrang(tinhTrang.getTenTinhTrang());
        dto.setMoTa(tinhTrang.getMoTa());
        return dto;
    }
}