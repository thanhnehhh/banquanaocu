package com.example.demo.service;

import com.example.demo.dto.BinhLuanDTO;
import com.example.demo.dto.TaoBinhLuanRequest;

import java.util.List;

public interface BinhLuanService {

    BinhLuanDTO taoBinhLuan(String email, TaoBinhLuanRequest request);

    List<BinhLuanDTO> getBinhLuanByProduct(long maSanPham);

    void xoaBinhLuan(String email, long maBinhLuan);
}
