package com.trusthire.controller;

import com.trusthire.dto.request.EmployerProfileRequest;
import com.trusthire.entity.EmployerProfile;
import com.trusthire.service.EmployerProfileService;
import com.trusthire.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employer")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerProfileService profileService;
    private final com.trusthire.service.AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<EmployerProfile>> getProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return profileService.getProfileByUserId(userId)
                .map(profile -> ResponseEntity.ok(ApiResponse.ok(profile)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Profile not found")));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<EmployerProfile>> getProfileByUserId(@PathVariable String userId) {
        return profileService.getProfileByUserId(userId)
                .map(profile -> ResponseEntity.ok(ApiResponse.ok(profile)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Profile not found")));
    }

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<EmployerProfile>> createProfile(Authentication authentication, @Valid @RequestBody EmployerProfileRequest request) {
        String userId = (String) authentication.getPrincipal();
        EmployerProfile profile = convertToEntity(request);
        EmployerProfile saved = profileService.createProfile(userId, profile);
        authService.setOnboarded(userId, true);
        return ResponseEntity.ok(ApiResponse.ok("Profile created", saved));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<EmployerProfile>> updateProfile(Authentication authentication, @Valid @RequestBody EmployerProfileRequest request) {
        String userId = (String) authentication.getPrincipal();
        EmployerProfile updates = convertToEntity(request);
        EmployerProfile saved = profileService.updateProfile(userId, updates);
        authService.setOnboarded(userId, true);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", saved));
    }

    private EmployerProfile convertToEntity(EmployerProfileRequest request) {
        return EmployerProfile.builder()
                .companyName(request.getCompanyName())
                .industry(request.getIndustry())
                .companyWebsite(request.getCompanyWebsite())
                .profileBio(request.getProfileBio())
                .businessTier(request.getBusinessTier())
                .address(request.getAddress())
                .city(request.getCity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
    }
}
