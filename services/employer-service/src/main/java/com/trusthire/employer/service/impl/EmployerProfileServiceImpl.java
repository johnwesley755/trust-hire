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
    public Optional<EmployerProfile> getProfileByClerkId(String clerkId) {
        log.info("Fetching employer profile for clerkId: {}", clerkId);
        return repository.findByClerkId(clerkId);
    }

    @Override
    @Transactional
    public EmployerProfile updateProfile(EmployerProfile profile) {
        log.info("Updating employer profile for clerkId: {}", profile.getClerkId());
        return repository.save(profile);
    }

    @Override
    @Transactional
    public EmployerProfile createProfile(String clerkId) {
        log.info("Creating employer profile for clerkId: {}", clerkId);
        if (repository.findByClerkId(clerkId).isPresent()) {
            throw new RuntimeException("Profile already exists");
        }
        EmployerProfile profile = EmployerProfile.builder()
                .id(UUID.randomUUID())
                .clerkId(clerkId)
                .isVerified(false)
                .businessTier("Silver")
                .build();
        return repository.save(profile);
    }
}
