package com.example.demo.websocket.dao;

import com.example.demo.entity.Conversation;
import com.example.demo.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Lấy tất cả tin nhắn của cuộc trò chuyện với phân trang
     */
    Page<Message> findByConversationOrderBySentAtDesc(Conversation conversation, Pageable pageable);

    /**
     * Lấy tin nhắn cuối cùng của cuộc trò chuyện
     */
    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation ORDER BY m.sentAt DESC")
    Optional<Message> findLastMessageByConversation(@Param("conversation") Conversation conversation);
}
