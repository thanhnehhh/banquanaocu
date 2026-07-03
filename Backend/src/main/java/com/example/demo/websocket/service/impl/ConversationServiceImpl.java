package com.example.demo.websocket.service.impl;

import com.example.demo.dao.UserRepository;
import com.example.demo.entity.Conversation;
import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import com.example.demo.exception.BusinessException;
import com.example.demo.websocket.dao.ConversationRepository;
import com.example.demo.websocket.dao.MessageRepository;
import com.example.demo.websocket.dto.ConversationResponseDTO;
import com.example.demo.websocket.dto.ConversationResponseDetail;
import com.example.demo.websocket.dto.CreateConversationRequest;
import com.example.demo.websocket.mapper.ConversationMapper;
import com.example.demo.websocket.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ConversationResponseDTO createConversation(CreateConversationRequest request, String creatorEmail) {
        // Tìm user tạo
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng"));

        List<User> members = new ArrayList<>();
        members.add(creator);

        // Nếu là chat 1-1 và chỉ có 1 member khác, kiểm tra xem đã có conversation chưa
        if (!request.getIsGroup() && request.getMemberIds().size() == 1) {
            Long otherUserId = request.getMemberIds().get(0);
            User otherUser = userRepository.findById(otherUserId)
                    .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng với ID: " + otherUserId));

            // Kiểm tra conversation 1-1 đã tồn tại chưa
            Optional<Conversation> existingConversation =
                    conversationRepository.findOneToOneConversation(creator, otherUser);

            if (existingConversation.isPresent()) {
                // Trả về conversation hiện có
                Conversation conversation = existingConversation.get();
                Message lastMessage = messageRepository.findLastMessageByConversation(conversation).orElse(null);
                return ConversationMapper.toConversationResponseDTO(conversation, lastMessage);
            }

            members.add(otherUser);
        } else {
            // Thêm các thành viên khác
            for (Long memberId : request.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng với ID: " + memberId));
                members.add(member);
            }
        }

        // Tạo conversation mới
        Conversation conversation = new Conversation();
        conversation.setName(request.getName());
        conversation.setIsGroup(request.getIsGroup());
        conversation.setMembers(members);

        Conversation saved = conversationRepository.save(conversation);

        return ConversationMapper.toConversationResponseDTO(saved, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponseDTO> getUserConversations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng"));

        List<Conversation> conversations = conversationRepository.findByMembersContaining(user);

        return conversations.stream()
                .map(conversation -> {
                    Message lastMessage = messageRepository.findLastMessageByConversation(conversation).orElse(null);
                    return ConversationMapper.toConversationResponseDTO(conversation, lastMessage);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationResponseDetail getConversationDetail(Long conversationId, String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy cuộc trò chuyện"));

        // Kiểm tra user có phải là thành viên không
        boolean isMember = conversation.getMembers().stream()
                .anyMatch(member -> member.getMaNguoiDung() == user.getMaNguoiDung());

        if (!isMember) {
            throw new BusinessException("Bạn không có quyền truy cập cuộc trò chuyện này");
        }

        Page<Message> messagesPage = messageRepository.findByConversationOrderBySentAtDesc(conversation, pageable);

        return ConversationMapper.toConversationResponseDetail(conversation, messagesPage);
    }
}
