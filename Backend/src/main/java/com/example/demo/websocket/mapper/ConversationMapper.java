package com.example.demo.websocket.mapper;

import com.example.demo.entity.Conversation;
import com.example.demo.entity.Message;
import com.example.demo.websocket.dto.ConversationResponseDTO;
import com.example.demo.websocket.dto.ConversationResponseDetail;
import com.example.demo.websocket.dto.MessageResponse;
import com.example.demo.websocket.dto.UserResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

public class ConversationMapper {

    public static ConversationResponseDTO toConversationResponseDTO(Conversation conversation, Message lastMessage) {
        if (conversation == null) {
            return null;
        }

        ConversationResponseDTO dto = new ConversationResponseDTO();
        dto.setConversationId(conversation.getConversationId());
        dto.setName(conversation.getName());
        dto.setIsGroup(conversation.getIsGroup());
        dto.setCreatedAt(conversation.getCreatedAt());

        List<UserResponse> members = conversation.getMembers().stream()
                .map(UserMapper::toUserResponse)
                .collect(Collectors.toList());
        dto.setMembers(members);

        dto.setLastMessage(MessageMapper.toMessageResponse(lastMessage));

        return dto;
    }

    public static ConversationResponseDetail toConversationResponseDetail(
            Conversation conversation,
            Page<Message> messagesPage) {

        if (conversation == null) {
            return null;
        }

        ConversationResponseDetail dto = new ConversationResponseDetail();
        dto.setConversationId(conversation.getConversationId());
        dto.setName(conversation.getName());
        dto.setIsGroup(conversation.getIsGroup());
        dto.setCreatedAt(conversation.getCreatedAt());

        List<UserResponse> members = conversation.getMembers().stream()
                .map(UserMapper::toUserResponse)
                .collect(Collectors.toList());
        dto.setMembers(members);

        List<MessageResponse> messages = messagesPage.getContent().stream()
                .map(MessageMapper::toMessageResponse)
                .collect(Collectors.toList());
        dto.setMessages(messages);

        dto.setTotalPages(messagesPage.getTotalPages());
        dto.setTotalElements(messagesPage.getTotalElements());
        dto.setCurrentPage(messagesPage.getNumber());

        return dto;
    }
}
