package com.example.demo.websocket.controller;

import com.example.demo.entity.Message;
import com.example.demo.websocket.dto.ChatMessage;
import com.example.demo.websocket.dto.ChatMessageResponse;
import com.example.demo.websocket.mapper.MessageMapper;
import com.example.demo.websocket.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Client gửi: /app/chat.send
     * Server broadcast tới: /topic/conversation/{conversationId}
     *
     * STOMP header cần: Authorization: Bearer <token>
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage, Principal principal) {
        if (principal == null) {
            return; // Không authenticated
        }

        try {
            // Lưu tin nhắn vào DB
            Message savedMessage = messageService.sendMessage(chatMessage, principal.getName());

            // Chuyển sang DTO để broadcast
            ChatMessageResponse response = MessageMapper.toChatMessageResponse(savedMessage);

            // Broadcast tới tất cả thành viên đang subscribe topic này
            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + chatMessage.getConversationId(),
                    response
            );
        } catch (Exception e) {
            // Log lỗi nhưng không crash WebSocket session
            System.err.println("Lỗi khi gửi tin nhắn: " + e.getMessage());
        }
    }
}
