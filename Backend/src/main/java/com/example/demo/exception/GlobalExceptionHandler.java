package com.example.demo.exception;

import com.example.demo.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

// Bắt tất cả exception từ mọi controller — không cần try-catch trong controller nữa.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt lỗi validation từ @Valid / @Validated trên @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<List<String>>> handleValidationException(
            MethodArgumentNotValidException ex) {

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .toList();

        return ApiResponse.error(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ", errors);
    }

    // Bắt lỗi nghiệp vụ từ BusinessException
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        return ApiResponse.error(ex.getStatus(), ex.getMessage());
    }

    // Bắt tất cả lỗi không mong muốn còn lại (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        ex.printStackTrace();
        return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi hệ thống, vui lòng thử lại sau.");
    }

    // Bắt lỗi đăng nhập sai thông tin
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(
            BadCredentialsException ex) {
        return ApiResponse.error(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng.");
    }
}
