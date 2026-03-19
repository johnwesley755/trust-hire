package com.trusthire.worker.controller;

import com.trusthire.worker.dto.ProfileCompletionStatus;
import com.trusthire.worker.dto.WorkerProfileSummary;
import com.trusthire.worker.entity.WorkerProfile;
import com.trusthire.worker.service.WorkerProfileService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
public class WorkerProfileController {

    private final WorkerProfileService profileService;

    @GetMapping("/profile")
    public ResponseEntity<WorkerProfile> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return profileService.getProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(profileService.createProfile(userId)));
    }

    @GetMapping("/internal/profiles/{userId}/completion")
    public ResponseEntity<ProfileCompletionStatus> getProfileCompletion(@PathVariable String userId) {
        return ResponseEntity.ok(profileService.getProfileCompletionStatus(userId));
    }

    @PostMapping("/profiles/by-user-ids")
    public ResponseEntity<java.util.List<WorkerProfileSummary>> getProfilesByUserIds(@RequestBody java.util.List<String> userIds) {
        return ResponseEntity.ok(profileService.getProfileSummariesByUserIds(userIds));
    }

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<WorkerProfile> updateProfile(@AuthenticationPrincipal Jwt jwt, @RequestBody WorkerProfile updates) {
        String userId = jwt.getSubject();
        WorkerProfile profile = profileService.getProfileByUserId(userId)
                .orElseGet(() -> profileService.createProfile(userId));

        if (updates.getFullName() != null) profile.setFullName(updates.getFullName());
        if (updates.getLocation() != null) profile.setLocation(updates.getLocation());
        if (updates.getLatitude() != null) profile.setLatitude(updates.getLatitude());
        if (updates.getLongitude() != null) profile.setLongitude(updates.getLongitude());
        if (updates.getCity() != null) profile.setCity(updates.getCity());
        if (updates.getAddress() != null) profile.setAddress(updates.getAddress());
        if (updates.getBio() != null) profile.setBio(updates.getBio());
        if (updates.getSkills() != null) profile.setSkills(updates.getSkills());
        if (updates.getExperienceYears() != null) profile.setExperienceYears(updates.getExperienceYears());
        if (updates.getHourlyRate() != null) profile.setHourlyRate(updates.getHourlyRate());
        if (updates.getLevel() != null) profile.setLevel(updates.getLevel());
        if (updates.getIsAvailable() != null) profile.setIsAvailable(updates.getIsAvailable());
        
        return ResponseEntity.ok(profileService.updateProfile(profile));
    }

    @PostMapping("/profile/{userId}/view")
    public ResponseEntity<Void> incrementProfileView(@PathVariable String userId) {
        profileService.incrementProfileViews(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trust-score/{userId}")
    public ResponseEntity<TrustScoreResponse> getTrustScore(@PathVariable String userId) {
        return ResponseEntity.ok(TrustScoreResponse.builder()
                .score(450)
                .identityVerified(false)
                .skillsVerifiedCount(0)
                .avgRating(0.0)
                .reliabilityRate(0.85)
                .lastUpdated(java.time.LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/stats")
    public ResponseEntity<WorkerStats> getGlobalStats() {
        return ResponseEntity.ok(WorkerStats.builder()
                .totalWorkers(profileService.getTotalWorkersCount())
                .build());
    }

    @Data @Builder
    public static class WorkerStats {
        private long totalWorkers;
    }

    @Data @Builder
    public static class TrustScoreResponse {
        private int score;
        private boolean identityVerified;
        private int skillsVerifiedCount;
        private double avgRating;
        private double reliabilityRate;
        private String lastUpdated;
    }
}
