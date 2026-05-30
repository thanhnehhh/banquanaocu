package com.example.demo.service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

public interface VNPayService {

    String taoUrlThanhToan(int maDonHang, long tongTien, String ipAddress);

    boolean xacThucChuKy(Map<String, String> params);

    String layIpAddress(HttpServletRequest request);
}