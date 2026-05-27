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

    private TinhTrangDTO convertToDTO(TinhTrang tinhTrang) {
        TinhTrangDTO dto = new TinhTrangDTO();
        dto.setMaTinhTrang(tinhTrang.getMaTinhTrang());
        dto.setTenTinhTrang(tinhTrang.getTenTinhTrang());
        dto.setMoTa(tinhTrang.getMoTa());
        return dto;
    }
}