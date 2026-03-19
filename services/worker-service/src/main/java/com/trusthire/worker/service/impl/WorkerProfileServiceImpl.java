package com.trusthire.worker.service.impl;

import com.trusthire.worker.dto.ProfileCompletionStatus;
import com.trusthire.worker.dto.WorkerProfileSummary;
import com.trusthire.worker.entity.WorkerProfile;
import com.trusthire.worker.repository.WorkerProfileRepository;
import com.trusthire.worker.service.WorkerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkerProfileServiceImpl implements WorkerProfileService {

    private final WorkerProfileRepository repository;
    private final com.trusthire.worker.client.SearchClient searchClient;
    private final com.trusthire.worker.client.AuthUserClient authUserClient;

    @Override
    public Optional<WorkerProfile> getProfileByUserId(String userId) {
        return repository.findByUserId(userId);
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
    public WorkerProfile createProfile(String userId) {
        if (repository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Profile already exists");
        }
        WorkerProfile profile = WorkerProfile.builder()
                .userId(userId)
                .isAvailable(true)
                .experienceYears(0)
                .level("L1")
                .build();
        WorkerProfile savedProfile = repository.save(profile);
        indexInSearch(savedProfile);
        return savedProfile;
    }

    @Override
    public ProfileCompletionStatus getProfileCompletionStatus(String userId) {
        Optional<WorkerProfile> profileOptional = repository.findByUserId(userId);
        if (profileOptional.isEmpty()) {
            return ProfileCompletionStatus.builder()
                    .complete(false)
                    .missingFields(requiredFields())
                    .build();
        }

        WorkerProfile profile = profileOptional.get();
        List<String> missingFields = new ArrayList<>();

        if (isBlank(profile.getFullName())) {
            missingFields.add("fullName");
        }
        if (isBlank(profile.getBio())) {
            missingFields.add("bio");
        }
        if (isBlank(profile.getSkills())) {
            missingFields.add("skills");
        }
        if (isBlank(profile.getAddress()) && isBlank(profile.getCity())) {
            missingFields.add("addressOrCity");
        }
        if (profile.getExperienceYears() == null) {
            missingFields.add("experienceYears");
        }
        if (isMissingHourlyRate(profile.getHourlyRate())) {
            missingFields.add("hourlyRate");
        }

        return ProfileCompletionStatus.builder()
                .complete(missingFields.isEmpty())
                .missingFields(missingFields)
                .build();
    }

    @Override
    public List<WorkerProfileSummary> getProfileSummariesByUserIds(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }

        java.util.Map<String, com.trusthire.worker.client.AuthUserClient.UserSummary> authUsersById;
        try {
            authUsersById = authUserClient.getUsersByIds(userIds).stream()
                    .collect(java.util.stream.Collectors.toMap(
                            com.trusthire.worker.client.AuthUserClient.UserSummary::getUserId,
                            user -> user,
                            (left, right) -> left
                    ));
        } catch (Exception exception) {
            authUsersById = java.util.Map.of();
        }

        final java.util.Map<String, com.trusthire.worker.client.AuthUserClient.UserSummary> authUsers = authUsersById;

        return repository.findByUserIdIn(userIds).stream()
                .map(profile -> WorkerProfileSummary.builder()
                        .userId(profile.getUserId())
                        .fullName(resolveFullName(profile.getFullName(), authUsers.get(profile.getUserId())))
                        .firstName(authUsers.get(profile.getUserId()) != null ? authUsers.get(profile.getUserId()).getFirstName() : null)
                        .lastName(authUsers.get(profile.getUserId()) != null ? authUsers.get(profile.getUserId()).getLastName() : null)
                        .email(authUsers.get(profile.getUserId()) != null ? authUsers.get(profile.getUserId()).getEmail() : null)
                        .phoneNumber(authUsers.get(profile.getUserId()) != null ? authUsers.get(profile.getUserId()).getPhoneNumber() : null)
                        .profileImageUrl(authUsers.get(profile.getUserId()) != null ? authUsers.get(profile.getUserId()).getProfileImageUrl() : null)
                        .address(profile.getAddress())
                        .city(profile.getCity())
                        .bio(profile.getBio())
                        .skills(profile.getSkills())
                        .experienceYears(profile.getExperienceYears())
                        .level(profile.getLevel())
                        .build())
                .toList();
    }

    @Override
    public long getTotalWorkersCount() {
        return repository.count();
    }

    @Override
    @Transactional
    public void incrementProfileViews(String userId) {
        repository.findByUserId(userId).ifPresent(profile -> {
            profile.setProfileViews(profile.getProfileViews() + 1);
            repository.save(profile);
        });
    }

    private String resolveFullName(String profileName, com.trusthire.worker.client.AuthUserClient.UserSummary authUser) {
        if (!isBlank(profileName)) {
            return profileName;
        }
        if (authUser == null) {
            return null;
        }
        String fullName = ((authUser.getFirstName() != null ? authUser.getFirstName() : "") + " " +
                (authUser.getLastName() != null ? authUser.getLastName() : "")).trim();
        return fullName.isEmpty() ? null : fullName;
    }

    private void indexInSearch(WorkerProfile profile) {
        try {
            com.trusthire.worker.client.SearchClient.WorkerSearchRequest request = com.trusthire.worker.client.SearchClient.WorkerSearchRequest.builder()
                    .userId(profile.getUserId())
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

    private List<String> requiredFields() {
        return List.of("fullName", "bio", "skills", "addressOrCity", "experienceYears", "hourlyRate");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean isMissingHourlyRate(BigDecimal hourlyRate) {
        return hourlyRate == null || hourlyRate.signum() <= 0;
    }
}
