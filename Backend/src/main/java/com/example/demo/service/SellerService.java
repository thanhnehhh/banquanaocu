package com.example.demo.service;

import com.example.demo.dto.SellerDTO;
import java.util.List;

public interface SellerService {
    SellerDTO getSellerById(long id);
    List<SellerDTO> getTopRatedSellers(int limit);
    List<SellerDTO> getTopSellersByProductCount(int limit);
}