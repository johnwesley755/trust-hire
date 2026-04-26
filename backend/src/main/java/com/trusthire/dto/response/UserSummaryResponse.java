package com.trusthire.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.trusthire.entity.UserMetadata;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {
    @JsonProperty("userId")
    private String userId;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("first_name")
    private String firstName;
    
    @JsonProperty("last_name")
    private String lastName;
    
    @JsonProperty("phone_number")
    private String phoneNumber;
    
    @JsonProperty("profile_image_url")
    private String profileImageUrl;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("onboarded")
    private Boolean onboarded;
    
    @JsonProperty("email_verified")
    private Boolean emailVerified;

    @JsonProperty("identity_verified")
    private Boolean identityVerified;

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
                .identityVerified(user.getIdentityVerified())
                .build();
    }
}
