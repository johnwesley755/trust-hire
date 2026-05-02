package com.trusthire.controller;

import com.trusthire.dto.request.*;
import com.trusthire.dto.response.AuthResponse;
import com.trusthire.dto.response.UserSummaryResponse;
import com.trusthire.entity.UserMetadata;
import com.trusthire.service.AuthService;
import com.trusthire.service.OtpService;
import com.trusthire.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    // POST /api/auth/send-otp
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        String email = request.getEmail();
        
        // Check if user already exists
        if (authService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("An account with this email already exists."));
        }

        otpService.generateAndSendOtp(email);
        return ResponseEntity.ok(ApiResponse.ok("OTP sent to " + email, "sent"));
    }

    // POST /api/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        String role = request.getRole();
        authService.processForgotPassword(email, role);
        return ResponseEntity.ok(ApiResponse.ok("Reset email sent successfully", "sent"));
    }

    // POST /api/auth/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String token = request.getToken();
        String password = request.getPassword();
        authService.resetPassword(token, password);
        return ResponseEntity.ok(ApiResponse.ok("Password updated successfully", "updated"));
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserMetadata>> getCurrentUser(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        UserMetadata user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    // POST /api/auth/sync
    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<UserMetadata>> syncUser(
            Authentication authentication,
            @RequestBody Map<String, Object> request) {
        String userId = (String) authentication.getPrincipal();
        UserMetadata updated = authService.syncUser(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("User synced", updated));
    }

    // POST /api/auth/internal/users/by-ids
    @PostMapping("/internal/users/by-ids")
    public ResponseEntity<ApiResponse<List<UserSummaryResponse>>> getUsersByIds(
            @RequestBody List<String> userIds) {
        return ResponseEntity.ok(ApiResponse.ok(authService.getUsersByIds(userIds)));
    }

    // POST /api/auth/webhooks/sync  (legacy no-op)
    @PostMapping("/webhooks/sync")
    public ResponseEntity<Void> handleLegacyWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Received legacy webhook sync event: {}", payload.get("type"));
        return ResponseEntity.ok().build();
    }
}
