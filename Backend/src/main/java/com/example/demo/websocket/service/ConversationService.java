package com.example.demo.websocket.service;

import com.example.demo.websocket.dto.ConversationResponseDTO;
import com.example.demo.websocket.dto.ConversationResponseDetail;
import com.example.demo.websocket.dto.CreateConversationRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ConversationService {

    /**
     * Tạo cuộc trò chuyện mới (1-1 hoặc group)
     */
    ConversationResponseDTO createConversation(CreateConversationRequest request, String creatorEmail);

    /**
     * Lấy danh sách cuộc trò chuyện của user
     */
    List<ConversationResponseDTO> getUserConversations(String userEmail);

    /**
     * Lấy chi tiết cuộc trò chuyện (bao gồm tin nhắn)
     */
    ConversationResponseDetail getConversationDetail(Long conversationId, String userEmail, Pageable pageable);
}
