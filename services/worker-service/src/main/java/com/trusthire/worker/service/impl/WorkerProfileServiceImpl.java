package com.trusthire.worker.service.impl;

import com.trusthire.worker.entity.WorkerProfile;
import com.trusthire.worker.repository.WorkerProfileRepository;
import com.trusthire.worker.service.WorkerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkerProfileServiceImpl implements WorkerProfileService {

    private final WorkerProfileRepository repository;

    @Override
    public Optional<WorkerProfile> getProfileByClerkId(String clerkId) {
        return repository.findByClerkId(clerkId);
    }

    @Override
    @Transactional
    public WorkerProfile updateProfile(WorkerProfile profile) {
        return repository.save(profile);
    }

    @Override
    @Transactional
    public WorkerProfile createProfile(String clerkId) {
        if (repository.findByClerkId(clerkId).isPresent()) {
            throw new RuntimeException("Profile already exists");
        }
        WorkerProfile profile = WorkerProfile.builder()
                .clerkId(clerkId)
                .isAvailable(true)
                .experienceYears(0)
                .build();
        return repository.save(profile);
    }
}
