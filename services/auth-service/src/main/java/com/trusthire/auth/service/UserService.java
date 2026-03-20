package com.trusthire.auth.service;

import com.trusthire.auth.entity.UserMetadata;
import java.util.Optional;

public interface UserService {
    Optional<UserMetadata> getUserByEmail(String email);
    boolean isEmailVerified(String email);
    void processForgotPassword(String email);
    void updatePassword(String token, String newPassword);
}
