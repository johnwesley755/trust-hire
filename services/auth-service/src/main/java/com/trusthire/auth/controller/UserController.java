package com.trusthire.auth.controller;

import com.trusthire.auth.dto.UserSummary;
import com.trusthire.auth.entity.UserMetadata;
import com.trusthire.auth.repository.UserMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    private final com.trusthire.auth.service.UserService userService;
    private final UserMetadataRepository repository;
    private final com.trusthire.auth.service.impl.OtpService otpService;
    private final com.trusthire.auth.security.JwtService jwtService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<UserMetadata> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return repository.findById(java.util.UUID.fromString(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/internal/users/by-ids")
    public ResponseEntity<List<UserSummary>> getUsersByIds(@org.springframework.web.bind.annotation.RequestBody List<String> userIds) {
        List<UUID> ids = userIds.stream()
                .distinct()
                .map(UUID::fromString)
                .toList();

        return ResponseEntity.ok(
                repository.findByIdIn(ids).stream()
                        .map(user -> UserSummary.builder()
                                .userId(user.getId().toString())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .email(user.getEmail())
                                .phoneNumber(user.getPhoneNumber())
                                .profileImageUrl(user.getProfileImageUrl())
                                .build())
                        .toList()
        );
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@org.springframework.web.bind.annotation.RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body("Email missing.");
        }
        otpService.generateAndSendOtp(email);
        return ResponseEntity.ok("OTP sent to " + email);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@org.springframework.web.bind.annotation.RequestBody RegisterRequest request) {
        System.out.println("DEBUG: Auth Controller - Registration attempt for: " + request.getEmail());
        
        // Ensure email isn't already taken
        if (repository.existsByEmail(request.getEmail())) {
            System.err.println("DEBUG: Auth Controller - Registration failed: Email already exists: " + request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        // Validate OTP
        if (!otpService.validateOtp(request.getEmail(), request.getOtp())) {
            System.err.println("DEBUG: Auth Controller - Registration failed: Invalid OTP for: " + request.getEmail());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired OTP")); 
        }

        UserMetadata newUser = UserMetadata.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .profileImageUrl(request.getProfileImageUrl())
                .role(request.getRole() != null ? UserMetadata.Role.valueOf(request.getRole()) : UserMetadata.Role.WORKER)
                .onboarded(false)
                .emailVerified(true) 
                .build();
                
        repository.save(newUser);
        String token = jwtService.generateToken(newUser);
        
        return ResponseEntity.ok(new AuthResponse(token, newUser));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@org.springframework.web.bind.annotation.RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        return repository.findByEmail(email)
            .filter(user -> passwordEncoder.matches(password, user.getPasswordHash()))
            .map(user -> {
                String token = jwtService.generateToken(user);
                return ResponseEntity.ok(new AuthResponse(token, user));
            })
            .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@org.springframework.web.bind.annotation.RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) return ResponseEntity.badRequest().body("Email missing");
        try {
            userService.processForgotPassword(email);
            return ResponseEntity.ok(Map.of("message", "Reset email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@org.springframework.web.bind.annotation.RequestBody Map<String, String> request) {
        String token = request.get("token");
        String password = request.get("password");
        if (token == null || password == null) return ResponseEntity.badRequest().body("Token or password missing");
        try {
            userService.updatePassword(token, password);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<UserMetadata> syncUser(org.springframework.security.core.Authentication authentication, @org.springframework.web.bind.annotation.RequestBody Map<String, Object> request) {
        String userId = (String) authentication.getPrincipal();
        return repository.findById(java.util.UUID.fromString(userId))
            .map(user -> {
                if (request.containsKey("role")) {
                    user.setRole(UserMetadata.Role.valueOf((String) request.get("role")));
                }
                if (request.containsKey("onboarded")) {
                    user.setOnboarded((Boolean) request.get("onboarded"));
                }
                if (request.containsKey("profileImageUrl")) {
                    user.setProfileImageUrl((String) request.get("profileImageUrl"));
                }
                repository.save(user);
                return ResponseEntity.ok(user);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/test/cleanup")
    public ResponseEntity<?> cleanupUser(@org.springframework.web.bind.annotation.RequestBody Map<String, String> request) {
        String email = request.get("email");
        return repository.findByEmail(email)
            .map(user -> {
                repository.delete(user);
                System.out.println("DEBUG: Auth Controller - Test Cleanup: Deleted user " + email);
                return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @lombok.Data
    public static class AuthResponse {
        private final String token;
        private final UserMetadata user;
    }

    @lombok.Data
    public static class RegisterRequest {
        private String email;
        private String password;
        
        @com.fasterxml.jackson.annotation.JsonProperty("phone")
        private String phoneNumber;
        
        private String firstName;
        private String lastName;
        
        @com.fasterxml.jackson.annotation.JsonProperty("profile_image_url")
        private String profileImageUrl;
        
        private String role;
        private String otp;
    }
}
