package com.example.demo.websocket.controller;

import com.example.demo.dao.UserRepository;
import com.example.demo.dto.ApiResponse;
import com.example.demo.websocket.dto.ConversationResponseDTO;
import com.example.demo.websocket.dto.ConversationResponseDetail;
import com.example.demo.websocket.dto.CreateConversationRequest;
import com.example.demo.websocket.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final UserRepository userRepository;

    // POST /api/conversations — Tạo cuộc trò chuyện mới (1-1 hoặc group)
    @PostMapping
    public ResponseEntity<ApiResponse<ConversationResponseDTO>> createConversation(
            @RequestBody java.util.Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        com.example.demo.websocket.dto.CreateConversationRequest request =
                new com.example.demo.websocket.dto.CreateConversationRequest();

        // Hỗ trợ cả 2 cách gọi:
        // 1. { memberIds: [123] }  — banquanaocu mới
        // 2. { emailOpponent: "abc@email.com" } — web_tmdt cũ
        if (body.containsKey("emailOpponent")) {
            String emailOpponent = (String) body.get("emailOpponent");
            com.example.demo.entity.User opponent = userRepository.findByEmail(emailOpponent)
                    .orElseThrow(() -> new com.example.demo.exception.BusinessException(
                            "Không tìm thấy người dùng: " + emailOpponent));
            request.setMemberIds(java.util.List.of(opponent.getMaNguoiDung()));
            request.setIsGroup(false);
        } else {
            @SuppressWarnings("unchecked")
            java.util.List<Integer> ids = (java.util.List<Integer>) body.get("memberIds");
            if (ids != null) {
                request.setMemberIds(ids.stream()
                        .map(Integer::longValue)
                        .collect(java.util.stream.Collectors.toList()));
            }
            request.setName((String) body.getOrDefault("name", null));
            Object isGroup = body.get("isGroup");
            request.setIsGroup(isGroup instanceof Boolean ? (Boolean) isGroup : false);
        }

        ConversationResponseDTO conversation = conversationService.createConversation(
                request, userDetails.getUsername());
        return ApiResponse.ok("Tạo cuộc trò chuyện thành công!", conversation);
    }

    // GET /api/conversations — Lấy danh sách cuộc trò chuyện của user hiện tại
    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationResponseDTO>>> getUserConversations(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ConversationResponseDTO> conversations = conversationService.getUserConversations(
                userDetails.getUsername());

        return ApiResponse.ok("Lấy danh sách cuộc trò chuyện thành công!", conversations);
    }

    // GET /api/conversations/{conversationId}?page=0&size=20 — Lấy chi tiết cuộc trò chuyện (tin nhắn phân trang)
    @GetMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationResponseDetail>> getConversationDetail(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        Pageable pageable = PageRequest.of(page, size);

        ConversationResponseDetail detail = conversationService.getConversationDetail(
                conversationId, userDetails.getUsername(), pageable);

        return ApiResponse.ok("Lấy chi tiết cuộc trò chuyện thành công!", detail);
    }
}
