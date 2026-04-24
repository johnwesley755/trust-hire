package com.trusthire.dto.response;

import com.trusthire.entity.UserMetadata;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profileImageUrl;
    private String role;
    private Boolean onboarded;
    private Boolean emailVerified;

    public static UserSummaryResponse fromEntity(UserMetadata user) {
        return UserSummaryResponse.builder()
                .userId(user.getId().toString())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .onboarded(user.getOnboarded())
                .emailVerified(user.getEmailVerified())
                .build();
    }
}
