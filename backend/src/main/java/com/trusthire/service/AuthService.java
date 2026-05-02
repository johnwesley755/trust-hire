package com.trusthire.service;

import com.trusthire.dto.request.RegisterRequest;
import com.trusthire.dto.response.AuthResponse;
import com.trusthire.dto.response.UserSummaryResponse;
import com.trusthire.entity.UserMetadata;

import java.util.List;
import java.util.Map;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(String email, String password);

    void sendOtp(String email);

    boolean existsByEmail(String email);

    void processForgotPassword(String email, String role);

    void resetPassword(String token, String newPassword);

    UserMetadata getCurrentUser(String userId);

    UserMetadata syncUser(String userId, Map<String, Object> updates);

    void setOnboarded(String userId, boolean onboarded);
    void setIdentityVerified(String userId, boolean verified);
    boolean isIdentityVerified(String userId);

    List<UserSummaryResponse> getUsersByIds(List<String> userIds);
}
