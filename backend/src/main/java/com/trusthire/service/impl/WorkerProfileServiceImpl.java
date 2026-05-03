package com.trusthire.service.impl;

import com.trusthire.dto.response.ProfileCompletionStatus;
import com.trusthire.dto.response.WorkerProfileSummary;
import com.trusthire.entity.UserMetadata;
import com.trusthire.entity.WorkerProfile;
import com.trusthire.entity.WorkerSearchIndex;
import com.trusthire.repository.UserMetadataRepository;
import com.trusthire.repository.WorkerProfileRepository;
import com.trusthire.service.SearchService;
import com.trusthire.service.WorkerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerProfileServiceImpl implements WorkerProfileService {

    private final WorkerProfileRepository profileRepository;
    private final UserMetadataRepository userMetadataRepository;
    private final com.trusthire.repository.RatingRepository ratingRepository;
    private final SearchService searchService;
    private final com.trusthire.service.LevelService levelService;
    private final com.trusthire.service.ActivityService activityService;

    @Override
    @Transactional
    public Optional<WorkerProfile> getProfileByUserId(String userId) {
        Optional<WorkerProfile> profile = profileRepository.findByUserId(userId);
        if (profile.isEmpty()) {
            WorkerProfile newProfile = WorkerProfile.builder()
                    .userId(userId)
                    .level("L1 Entry")
                    .levelNumber(1)
                    .skillScore(30.0)
                    .trustScore(30) // Initial trust score for L1
                    .isAvailable(true)
                    .profileViews(0L)
                    .totalJobs(0)
                    .completedJobs(0)
                    .abscondCount(0)
                    .build();
            WorkerProfile saved = profileRepository.save(newProfile);
            indexWorker(saved);
            
            activityService.logActivity(
                userId,
                "PROFILE_CREATED",
                "Your professional profile has been established",
                saved.getId().toString()
            );
            return Optional.of(saved);
        }
        return profile;
    }

    @Override
    @Transactional
    public WorkerProfile createProfile(String userId) {
        return getProfileByUserId(userId).orElseThrow();
    }

    private void indexWorker(WorkerProfile profile) {
        boolean isVerified = userMetadataRepository.findById(java.util.UUID.fromString(profile.getUserId()))
                .map(UserMetadata::getIdentityVerified)
                .orElse(false);

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
                .isVerified(isVerified)
                .status(profile.getIsAvailable() ? "AVAILABLE" : "BUSY")
                .trustScore(profile.getTrustScore())
                .build());
    }

    @Override
    @Transactional
    public WorkerProfile updateProfile(WorkerProfile profile) {
        WorkerProfile saved = profileRepository.save(profile);
        indexWorker(saved);
        
        activityService.logActivity(
            saved.getUserId(),
            "PROFILE_UPDATED",
            "Professional profile details updated",
            saved.getId().toString()
        );
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
        List<WorkerProfile> profiles = profileRepository.findByUserIdIn(userIds);
        
        // Batch fetch all UserMetadata to avoid N+1 problem
        List<java.util.UUID> uuids = userIds.stream()
                .map(id -> {
                    try { return java.util.UUID.fromString(id); }
                    catch (Exception e) { return null; }
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
        
        java.util.Map<String, UserMetadata> userMap = userMetadataRepository.findAllById(uuids).stream()
                .collect(Collectors.toMap(u -> u.getId().toString(), u -> u));

        return profiles.stream()
                .map(profile -> WorkerProfileSummary.fromEntity(profile, userMap.get(profile.getUserId())))
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

    @Override
    public Double getAverageRating(String userId) {
        return ratingRepository.getAverageRating(userId);
    }

    @Override
    public int getRatingCount(String userId) {
        Integer count = ratingRepository.getRatingCount(userId);
        return count != null ? count : 0;
    }

    @Override
    public int getTrustScore(String userId) {
        levelService.calculateAndSaveLevel(userId);
        return profileRepository.findByUserId(userId)
                .map(WorkerProfile::getTrustScore)
                .orElse(30);
    }

    @Override
    public int getVerifiedSkillsCount(String userId) {
        return profileRepository.findByUserId(userId)
                .map(p -> p.getSkills() != null ? p.getSkills().split(",").length : 0)
                .orElse(0);
    }
}
