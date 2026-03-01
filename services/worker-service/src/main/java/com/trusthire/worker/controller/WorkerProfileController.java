package com.trusthire.worker.controller;

import com.trusthire.worker.entity.WorkerProfile;
import com.trusthire.worker.service.WorkerProfileService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
public class WorkerProfileController {

    private final WorkerProfileService profileService;

    @GetMapping("/profile")
    public ResponseEntity<WorkerProfile> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        return profileService.getProfileByClerkId(clerkId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(profileService.createProfile(clerkId)));
    }

    @PutMapping("/profile")
    public ResponseEntity<WorkerProfile> updateProfile(@AuthenticationPrincipal Jwt jwt, @RequestBody WorkerProfile profile) {
        String clerkId = jwt.getSubject();
        profile.setClerkId(clerkId); // Ensure they can only update their own profile
        return ResponseEntity.ok(profileService.updateProfile(profile));
    }

    @GetMapping("/trust-score/{clerkId}")
    public ResponseEntity<TrustScoreResponse> getTrustScore(@PathVariable String clerkId) {
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
