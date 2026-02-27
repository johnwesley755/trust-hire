package com.trusthire.auth.service;

import com.trusthire.auth.entity.UserMetadata;
import java.util.Optional;

public interface UserService {
    Optional<UserMetadata> getUserByClerkId(String clerkId);
    Optional<UserMetadata> getUserByEmail(String email);
    boolean isEmailVerified(String clerkId);
}
