package com.trusthire.service.impl;

import com.trusthire.dto.request.RegisterRequest;
import com.trusthire.dto.response.AuthResponse;
import com.trusthire.dto.response.UserSummaryResponse;
import com.trusthire.entity.EmployerProfile;
import com.trusthire.entity.UserMetadata;
import com.trusthire.entity.WorkerProfile;
import com.trusthire.exception.BadRequestException;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.exception.UnauthorizedException;
import com.trusthire.repository.EmployerProfileRepository;
import com.trusthire.repository.UserMetadataRepository;
import com.trusthire.repository.WorkerProfileRepository;
import com.trusthire.security.JwtService;
import com.trusthire.service.AuthService;
import com.trusthire.service.NotificationSenderService;
import com.trusthire.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserMetadataRepository userRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final NotificationSenderService notificationSenderService;

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    @Value("${BREVO_SENDER_EMAIL}")
    private String fromEmail;

    @Value("${BREVO_SENDER_NAME:TrustHire}")
    private String fromName;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }
        if (!otpService.validateOtp(request.getEmail(), request.getOtp())) {
            throw new UnauthorizedException("Invalid or expired OTP.");
        }

        UserMetadata newUser = UserMetadata.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .profileImageUrl(request.getProfileImageUrl())
                .role(request.getRole() != null
                        ? UserMetadata.Role.valueOf(request.getRole().toUpperCase())
                        : UserMetadata.Role.WORKER)
                .emailVerified(true)
                .onboarded(false)
                .build();

        userRepository.save(newUser);
        log.info("Registered new user: {}", newUser.getEmail());

        // Create empty profile based on role
        if (newUser.getRole() == UserMetadata.Role.EMPLOYER) {
            EmployerProfile employerProfile = EmployerProfile.builder()
                    .userId(newUser.getId().toString())
                    .companyName(newUser.getFirstName() + "'s Company")
                    .build();
            employerProfileRepository.save(employerProfile);
            log.info("Created employer profile for user: {}", newUser.getEmail());
        } else {
            WorkerProfile workerProfile = WorkerProfile.builder()
                    .userId(newUser.getId().toString())
                    .fullName(newUser.getFirstName() + " " + newUser.getLastName())
                    .level("L1")
                    .levelNumber(1)
                    .build();
            workerProfileRepository.save(workerProfile);
            log.info("Created worker profile for user: {}", newUser.getEmail());
        }

        // Send Welcome Notification
        notificationSenderService.sendNotification(
            newUser.getId().toString(),
            "Welcome to TrustHire!",
            "Thank you for joining us, " + newUser.getFirstName() + "! Complete your profile to get started.",
            "WELCOME"
        );

        return AuthResponse.of(jwtService.generateToken(newUser), newUser);
    }

    @Override
    public AuthResponse login(String email, String password) {
        UserMetadata user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }
        return AuthResponse.of(jwtService.generateToken(user), user);
    }

    @Override
    public void sendOtp(String email) {
        otpService.generateAndSendOtp(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void processForgotPassword(String email) {
        UserMetadata user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        try {
            if (apiKey == null || apiKey.isEmpty()) {
                log.error("BREVO_API_KEY is missing from environment!");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);
            headers.set("x-sib-api-key", apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", Map.of("name", fromName, "email", fromEmail));
            body.put("to", Collections.singletonList(Map.of("email", email)));
            body.put("subject", "TrustHire - Password Reset");
            body.put("textContent", String.format("Hello,\n\nUse this token to reset your password:\n%s\n\nThis expires in 1 hour.", resetToken));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", entity, String.class);
            log.info("Password reset email sent to {}", email);
        } catch (Exception e) {
            log.error("Failed to send reset email: {}", e.getMessage());
            throw new RuntimeException("Failed to send reset email.");
        }
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        UserMetadata user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token."));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        log.info("Password reset for user: {}", user.getEmail());
    }

    @Override
    public UserMetadata getCurrentUser(String userId) {
        return userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    @Override
    @Transactional
    public UserMetadata syncUser(String userId, Map<String, Object> updates) {
        UserMetadata user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (updates.containsKey("role")) {
            UserMetadata.Role newRole = UserMetadata.Role.valueOf((String) updates.get("role"));
            if (user.getRole() != newRole) {
                user.setRole(newRole);
                
                // Ensure profile exists for the new role
                if (newRole == UserMetadata.Role.EMPLOYER) {
                    if (!employerProfileRepository.existsByUserId(userId)) {
                        employerProfileRepository.save(EmployerProfile.builder()
                                .userId(userId)
                                .companyName(user.getFirstName() + "'s Company")
                                .build());
                    }
                    user.setOnboarded(false); // Force onboarding for new role
                } else if (newRole == UserMetadata.Role.WORKER) {
                    if (!workerProfileRepository.existsByUserId(userId)) {
                        workerProfileRepository.save(WorkerProfile.builder()
                                .userId(userId)
                                .fullName(user.getFirstName() + " " + user.getLastName())
                                .level("L1")
                                .levelNumber(1)
                                .build());
                    }
                    user.setOnboarded(false);
                }
            }
        }
        if (updates.containsKey("onboarded")) {
            user.setOnboarded((Boolean) updates.get("onboarded"));
        }
        if (updates.containsKey("identityVerified")) {
            user.setIdentityVerified((Boolean) updates.get("identityVerified"));
        }
        if (updates.containsKey("profileImageUrl")) {
            user.setProfileImageUrl((String) updates.get("profileImageUrl"));
        }
        return userRepository.save(user);
    }

    @Override
    public List<UserSummaryResponse> getUsersByIds(List<String> userIds) {
        List<UUID> ids = userIds.stream()
                .distinct()
                .map(UUID::fromString)
                .collect(Collectors.toList());
        return userRepository.findByIdIn(ids).stream()
                .map(UserSummaryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void setOnboarded(String userId, boolean onboarded) {
        UserMetadata user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        user.setOnboarded(onboarded);
        userRepository.save(user);
        log.info("User {} onboarding status set to: {}", userId, onboarded);
    }

    @Override
    @Transactional
    public void setIdentityVerified(String userId, boolean verified) {
        userRepository.findById(UUID.fromString(userId)).ifPresent(user -> {
            user.setIdentityVerified(verified);
            userRepository.save(user);
        });
    }

    @Override
    public boolean isIdentityVerified(String userId) {
        return userRepository.findById(UUID.fromString(userId))
                .map(UserMetadata::getIdentityVerified)
                .orElse(false);
    }
}
