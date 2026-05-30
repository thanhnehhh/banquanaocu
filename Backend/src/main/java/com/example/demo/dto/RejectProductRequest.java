package com.example.demo.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectProductRequest {

    @NotBlank(message = "Lý do từ chối không được để trống")
    private String lyDo;
}
