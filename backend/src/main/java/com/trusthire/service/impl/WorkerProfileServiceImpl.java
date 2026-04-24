package com.trusthire.service.impl;

import com.trusthire.dto.response.ProfileCompletionStatus;
import com.trusthire.dto.response.WorkerProfileSummary;
import com.trusthire.entity.WorkerProfile;
import com.trusthire.entity.WorkerSearchIndex;
import com.trusthire.repository.WorkerProfileRepository;
import com.trusthire.service.SearchService;
import com.trusthire.service.WorkerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerProfileServiceImpl implements WorkerProfileService {

    private final WorkerProfileRepository profileRepository;
    private final SearchService searchService;

    @Override
    public Optional<WorkerProfile> getProfileByUserId(String userId) {
        return profileRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public WorkerProfile createProfile(String userId) {
        WorkerProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> profileRepository.save(WorkerProfile.builder()
                        .userId(userId)
                        .level("L1")
                        .levelNumber(1)
                        .skillScore(30.0)
                        .isAvailable(true)
                        .profileViews(0L)
                        .build()));
        indexWorker(profile);
        return profile;
    }

    private void indexWorker(WorkerProfile profile) {
        searchService.indexWorker(WorkerSearchIndex.builder()
                .userId(profile.getUserId())
                .name(profile.getFullName() != null ? profile.getFullName() : "Anonymous")
                .bio(profile.getBio())
                .skills(profile.getSkills())
                .location(profile.getLocation())
                .city(profile.getCity())
                .latitude(profile.getLatitude())
                .longitude(profile.getLongitude())
                .level(profile.getLevel())
                .isVerified(false) // Default
                .status(profile.getIsAvailable() ? "AVAILABLE" : "BUSY")
                .build());
    }

    @Override
    @Transactional
    public WorkerProfile updateProfile(WorkerProfile profile) {
        WorkerProfile saved = profileRepository.save(profile);
        indexWorker(saved);
        return saved;
    }

    @Override
    public ProfileCompletionStatus getProfileCompletionStatus(String userId) {
        Optional<WorkerProfile> profileOpt = profileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            return ProfileCompletionStatus.builder().percentage(0).build();
        }
        WorkerProfile profile = profileOpt.get();
        
        boolean bio = profile.getBio() != null && !profile.getBio().isBlank();
        boolean skills = profile.getSkills() != null && !profile.getSkills().isBlank();
        boolean location = profile.getCity() != null && !profile.getCity().isBlank();
        boolean contact = profile.getFullName() != null && !profile.getFullName().isBlank();
        
        int count = 0;
        if (bio) count++;
        if (skills) count++;
        if (location) count++;
        if (contact) count++;
        
        return ProfileCompletionStatus.builder()
                .percentage(count * 25)
                .isBioComplete(bio)
                .isSkillsComplete(skills)
                .isLocationComplete(location)
                .isContactComplete(contact)
                .build();
    }

    @Override
    public List<WorkerProfileSummary> getProfileSummariesByUserIds(List<String> userIds) {
        return profileRepository.findByUserIdIn(userIds).stream()
                .map(WorkerProfileSummary::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void incrementProfileViews(String userId) {
        profileRepository.findByUserId(userId).ifPresent(profile -> {
            profile.setProfileViews(profile.getProfileViews() + 1);
            profileRepository.save(profile);
        });
    }

    @Override
    public long getTotalWorkersCount() {
        return profileRepository.count();
    }
}
