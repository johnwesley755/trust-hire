package com.trusthire.dto.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
    private String role;
}
