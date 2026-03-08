package com.trusthire.worker.controller;

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
        if (updates.getBio() != null) profile.setBio(updates.getBio());
        if (updates.getSkills() != null) profile.setSkills(updates.getSkills());
        if (updates.getExperienceYears() != null) profile.setExperienceYears(updates.getExperienceYears());
        if (updates.getHourlyRate() != null) profile.setHourlyRate(updates.getHourlyRate());
        if (updates.getIsAvailable() != null) profile.setIsAvailable(updates.getIsAvailable());
        
        return ResponseEntity.ok(profileService.updateProfile(profile));
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
