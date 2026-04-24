package com.trusthire.dto.response;

import com.trusthire.entity.UserMetadata;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserSummaryResponse user;

    public static AuthResponse of(String token, UserMetadata user) {
        return AuthResponse.builder()
                .token(token)
                .user(UserSummaryResponse.fromEntity(user))
                .build();
    }
}
