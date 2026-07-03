package com.example.demo.websocket.service.impl;

import com.example.demo.dao.UserRepository;
import com.example.demo.entity.Conversation;
import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import com.example.demo.exception.BusinessException;
import com.example.demo.websocket.dao.ConversationRepository;
import com.example.demo.websocket.dao.MessageRepository;
import com.example.demo.websocket.dto.ChatMessage;
import com.example.demo.websocket.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Message sendMessage(ChatMessage chatMessage, String senderEmail) {
        // Tìm user
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng"));

        // Tìm conversation
        Conversation conversation = conversationRepository.findById(chatMessage.getConversationId())
                .orElseThrow(() -> new BusinessException("Không tìm thấy cuộc trò chuyện"));

        // Kiểm tra user có phải là thành viên không
        boolean isMember = conversation.getMembers().stream()
                .anyMatch(member -> member.getMaNguoiDung() == sender.getMaNguoiDung());

        if (!isMember) {
            throw new BusinessException("Bạn không phải là thành viên của cuộc trò chuyện này");
        }

        // Tạo message mới
        Message message = new Message();
        message.setContent(chatMessage.getContent());
        message.setSender(sender);
        message.setConversation(conversation);

        return messageRepository.save(message);
    }
}
