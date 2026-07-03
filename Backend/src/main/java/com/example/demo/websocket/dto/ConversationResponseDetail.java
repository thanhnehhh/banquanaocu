package com.example.demo.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponseDetail {
    private Long conversationId;
    private String name;
    private Boolean isGroup;
    private LocalDateTime createdAt;
    private List<UserResponse> members;
    private List<MessageResponse> messages;
    private int totalPages;
    private long totalElements;
    private int currentPage;
}
