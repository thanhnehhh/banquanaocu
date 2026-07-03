package com.example.demo.websocket.mapper;

import com.example.demo.entity.User;
import com.example.demo.websocket.dto.UserResponse;

public class UserMapper {

    public static UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        UserResponse dto = new UserResponse();
        dto.setMaNguoiDung(user.getMaNguoiDung());
        dto.setHoDem(user.getHoDem());
        dto.setTen(user.getTen());
        dto.setEmail(user.getEmail());
        dto.setAvatar(user.getAvatar());
        return dto;
    }
}
