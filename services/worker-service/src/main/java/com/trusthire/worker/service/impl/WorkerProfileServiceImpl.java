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
    private final com.trusthire.worker.client.SearchClient searchClient;

    @Override
    public Optional<WorkerProfile> getProfileByClerkId(String clerkId) {
        return repository.findByClerkId(clerkId);
    }

    @Override
    @Transactional
    public WorkerProfile updateProfile(WorkerProfile profile) {
        WorkerProfile savedProfile = repository.save(profile);
        indexInSearch(savedProfile);
        return savedProfile;
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
                .level("L1")
                .build();
        WorkerProfile savedProfile = repository.save(profile);
        indexInSearch(savedProfile);
        return savedProfile;
    }

    private void indexInSearch(WorkerProfile profile) {
        try {
            com.trusthire.worker.client.SearchClient.WorkerSearchRequest request = com.trusthire.worker.client.SearchClient.WorkerSearchRequest.builder()
                    .clerkId(profile.getClerkId())
                    .name(profile.getFullName() != null ? profile.getFullName() : "Anonymous Worker")
                    .bio(profile.getBio())
                    .skills(profile.getSkills() != null ? String.join(", ", profile.getSkills()) : "")
                    .location(profile.getLocation())
                    .latitude(profile.getLatitude())
                    .longitude(profile.getLongitude())
                    .level(profile.getLevel())
                    .isVerified(false) // Verification status would come from verification-service
                    .status(profile.getIsAvailable() != null && profile.getIsAvailable() ? "AVAILABLE" : "BUSY")
                    .build();
            searchClient.indexWorker(request);
        } catch (Exception e) {
            // Log and continue, search indexing is secondary
        }
    }
}
