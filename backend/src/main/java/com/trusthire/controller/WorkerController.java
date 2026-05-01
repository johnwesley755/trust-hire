package com.trusthire.controller;

import com.trusthire.dto.request.WorkerProfileRequest;
import com.trusthire.dto.response.ProfileCompletionStatus;
import com.trusthire.dto.response.WorkerProfileSummary;
import com.trusthire.entity.WorkerProfile;
import com.trusthire.service.WorkerProfileService;
import com.trusthire.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerProfileService profileService;
    private final com.trusthire.service.AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<WorkerProfile>> getMyProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        WorkerProfile profile = profileService.getProfileByUserId(userId)
                .orElseGet(() -> profileService.createProfile(userId));
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<WorkerProfile>> updateProfile(Authentication authentication, @Valid @RequestBody WorkerProfileRequest updates) {
        String userId = (String) authentication.getPrincipal();
        WorkerProfile profile = profileService.getProfileByUserId(userId)
                .orElseGet(() -> profileService.createProfile(userId));

        profile.setFullName(updates.getFullName());
        profile.setLocation(updates.getLocation());
        profile.setLatitude(updates.getLatitude());
        profile.setLongitude(updates.getLongitude());
        profile.setCity(updates.getCity());
        profile.setAddress(updates.getAddress());
        profile.setBio(updates.getBio());
        profile.setSkills(updates.getSkills());
        profile.setExperienceYears(updates.getExperienceYears());
        profile.setHourlyRate(updates.getHourlyRate());
        
        if (updates.getLevel() != null) profile.setLevel(updates.getLevel());
        if (updates.getIsAvailable() != null) profile.setIsAvailable(updates.getIsAvailable());
        
        WorkerProfile saved = profileService.updateProfile(profile);
        authService.setOnboarded(userId, true);
        
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", saved));
    }

    @GetMapping("/internal/profiles/{userId}/completion")
    public ResponseEntity<ApiResponse<ProfileCompletionStatus>> getProfileCompletion(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfileCompletionStatus(userId)));
    }

    @PostMapping("/profiles/by-user-ids")
    public ResponseEntity<ApiResponse<List<WorkerProfileSummary>>> getProfilesByUserIds(@RequestBody List<String> userIds) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfileSummariesByUserIds(userIds)));
    }

    @PostMapping("/profile/{userId}/view")
    public ResponseEntity<ApiResponse<Void>> incrementProfileView(@PathVariable String userId) {
        profileService.incrementProfileViews(userId);
        return ResponseEntity.ok(ApiResponse.ok("View incremented", null));
    }

    @GetMapping("/trust-score/{userId}")
    public ResponseEntity<ApiResponse<TrustScoreResponse>> getTrustScore(@PathVariable String userId) {
        Double avgRating = profileService.getAverageRating(userId);
        int ratingCount = profileService.getRatingCount(userId);
        boolean identityVerified = authService.isIdentityVerified(userId);
        int trustScore = profileService.getTrustScore(userId);

        return ResponseEntity.ok(ApiResponse.ok(TrustScoreResponse.builder()
                .score(trustScore)
                .identityVerified(identityVerified)
                .skillsVerifiedCount(profileService.getVerifiedSkillsCount(userId))
                .avgRating(avgRating != null ? avgRating : 0.0)
                .reliabilityRate(0.95) // TODO: Calculate from job attendance
                .lastUpdated(java.time.LocalDateTime.now().toString())
                .build()));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<WorkerStats>> getGlobalStats() {
        return ResponseEntity.ok(ApiResponse.ok(WorkerStats.builder()
                .totalWorkers(profileService.getTotalWorkersCount())
                .build()));
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
