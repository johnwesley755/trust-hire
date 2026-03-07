package com.trusthire.auth.controller;

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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserMetadataRepository repository;

    @GetMapping("/me")
    public ResponseEntity<UserMetadata> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        return repository.findByClerkId(clerkId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/sync")
    public ResponseEntity<UserMetadata> syncUser(
            @AuthenticationPrincipal Jwt jwt,
            @org.springframework.web.bind.annotation.RequestBody(required = false) SyncRequest request) {
        
        String clerkId = jwt.getSubject();
        UserMetadata user = repository.findByClerkId(clerkId)
                .orElseGet(() -> {
                    UserMetadata newUser = UserMetadata.builder()
                            .clerkId(clerkId)
                            .email(jwt.getClaimAsString("email") != null ? jwt.getClaimAsString("email") : "user@placeholder.com")
                            .role(request != null && request.getRole() != null ? UserMetadata.Role.valueOf(request.getRole()) : UserMetadata.Role.WORKER)
                            .onboarded(false)
                            .emailVerified(jwt.getClaimAsBoolean("email_verified"))
                            .build();
                    return repository.save(newUser);
                });

        if (request != null) {
            if (request.getRole() != null) user.setRole(UserMetadata.Role.valueOf(request.getRole()));
            if (request.getOnboarded() != null) user.setOnboarded(request.getOnboarded());
            repository.save(user);
        }

        return ResponseEntity.ok(user);
    }

    @lombok.Data
    public static class SyncRequest {
        private String role;
        private Boolean onboarded;
    }
}
