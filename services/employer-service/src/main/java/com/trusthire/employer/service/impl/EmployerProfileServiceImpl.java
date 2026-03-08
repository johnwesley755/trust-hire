package com.trusthire.employer.service.impl;

import com.trusthire.employer.entity.EmployerProfile;
import com.trusthire.employer.repository.EmployerProfileRepository;
import com.trusthire.employer.service.EmployerProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployerProfileServiceImpl implements EmployerProfileService {

    private final EmployerProfileRepository repository;

    @Override
    public Optional<EmployerProfile> getProfileByUserId(String userId) {
        log.info("Fetching employer profile for userId: {}", userId);
        return repository.findByUserId(userId);
    }

    @Override
    @Transactional
    public EmployerProfile updateProfile(EmployerProfile profile) {
        log.info("Updating employer profile for userId: {}", profile.getUserId());
        return repository.save(profile);
    }

    @Override
    @Transactional
    public EmployerProfile createProfile(String userId) {
        log.info("Creating employer profile for userId: {}", userId);
        if (repository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Profile already exists");
        }
        EmployerProfile profile = EmployerProfile.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .isVerified(false)
                .businessTier("Silver")
                .build();
        return repository.save(profile);
    }
}
