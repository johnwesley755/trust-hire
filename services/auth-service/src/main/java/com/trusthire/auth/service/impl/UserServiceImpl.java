package com.trusthire.auth.service.impl;

import com.trusthire.auth.entity.UserMetadata;
import com.trusthire.auth.repository.UserMetadataRepository;
import com.trusthire.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMetadataRepository repository;

    @Override
    public Optional<UserMetadata> getUserByClerkId(String clerkId) {
        return repository.findByClerkId(clerkId);
    }

    @Override
    public Optional<UserMetadata> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public boolean isEmailVerified(String clerkId) {
        return repository.findByClerkId(clerkId)
                .map(UserMetadata::getEmailVerified)
                .orElse(false);
    }
}
