package com.example.demo.websocket.controller;

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

    /**
     * POST /api/conversations
     * Tạo cuộc trò chuyện mới
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ConversationResponseDTO>> createConversation(
            @RequestBody CreateConversationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        ConversationResponseDTO conversation = conversationService.createConversation(
                request, userDetails.getUsername());

        return ApiResponse.ok("Tạo cuộc trò chuyện thành công!", conversation);
    }

    /**
     * GET /api/conversations
     * Lấy danh sách cuộc trò chuyện của user hiện tại
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationResponseDTO>>> getUserConversations(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ConversationResponseDTO> conversations = conversationService.getUserConversations(
                userDetails.getUsername());

        return ApiResponse.ok("Lấy danh sách cuộc trò chuyện thành công!", conversations);
    }

    /**
     * GET /api/conversations/{conversationId}?page=0&size=20
     * Lấy chi tiết cuộc trò chuyện (bao gồm tin nhắn với phân trang)
     */
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
