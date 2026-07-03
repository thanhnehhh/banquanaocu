package com.example.demo.websocket.dao;

import com.example.demo.entity.Conversation;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    /**
     * Tìm tất cả cuộc trò chuyện mà user là thành viên
     */
    @Query("SELECT DISTINCT c FROM Conversation c JOIN FETCH c.members m WHERE :user MEMBER OF c.members ORDER BY c.createdAt DESC")
    List<Conversation> findByMembersContaining(@Param("user") User user);

    /**
     * Tìm cuộc trò chuyện 1-1 giữa 2 user
     */
    @Query("SELECT c FROM Conversation c JOIN c.members m1 JOIN c.members m2 " +
           "WHERE c.isGroup = false AND m1 = :user1 AND m2 = :user2")
    Optional<Conversation> findOneToOneConversation(@Param("user1") User user1, @Param("user2") User user2);
}
