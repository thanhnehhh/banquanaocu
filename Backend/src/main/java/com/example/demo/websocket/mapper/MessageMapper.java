package com.example.demo.websocket.mapper;

import com.example.demo.entity.Message;
import com.example.demo.websocket.dto.ChatMessageResponse;
import com.example.demo.websocket.dto.MessageResponse;

public class MessageMapper {

    public static MessageResponse toMessageResponse(Message message) {
        if (message == null) {
            return null;
        }
        MessageResponse dto = new MessageResponse();
        dto.setMessageId(message.getMessageId());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setSender(UserMapper.toUserResponse(message.getSender()));
        dto.setConversationId(message.getConversation().getConversationId());
        return dto;
    }

    public static ChatMessageResponse toChatMessageResponse(Message message) {
        if (message == null) {
            return null;
        }
        ChatMessageResponse dto = new ChatMessageResponse();
        dto.setMessageId(message.getMessageId());
        dto.setConversationId(message.getConversation().getConversationId());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setSender(UserMapper.toUserResponse(message.getSender()));
        return dto;
    }
}
