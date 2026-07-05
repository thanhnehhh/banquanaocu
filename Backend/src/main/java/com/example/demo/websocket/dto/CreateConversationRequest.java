package com.example.demo.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {
    // Danh sách maNguoiDung của các thành viên (không bao gồm người tạo)
    private List<Long> memberIds;
    // Tên cuộc trò chuyện (cho group chat)
    private String name;
    // true = group chat, false = chat 1-1
    private Boolean isGroup = false;
}
