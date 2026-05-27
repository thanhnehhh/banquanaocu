package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Cấu trúc response chuẩn dùng cho toàn bộ API.
 *
 * JSON trả về:
 * {
 * "success": true,
 * "message": "...",
 * "data": { ... }   // null thì bị bỏ qua trong JSON
 * }
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL) // Không serialize field null (data)
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;

    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // ================================================================
    // SUCCESS — 200 OK
    // ================================================================

    public static <T> ResponseEntity<ApiResponse<T>> ok(String message) {
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(String message, T data) {
        return ResponseEntity.ok(new ApiResponse<>(true, message, data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(String message, T data) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, message, data));
    }

    // ================================================================
    // ERROR — Tùy HTTP status
    // ================================================================

    public static <T> ResponseEntity<ApiResponse<T>> error(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(new ApiResponse<>(false, message, null));
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(HttpStatus status, String message, T data) {
        return ResponseEntity
                .status(status)
                .body(new ApiResponse<>(false, message, data));
    }
}