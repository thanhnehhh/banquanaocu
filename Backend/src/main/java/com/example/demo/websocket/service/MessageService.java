package com.example.demo.websocket.service;

import com.example.demo.entity.Message;
import com.example.demo.websocket.dto.ChatMessage;

public interface MessageService {

    /**
     * Gửi tin nhắn vào cuộc trò chuyện
     */
    Message sendMessage(ChatMessage chatMessage, String senderEmail);
}
