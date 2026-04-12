package com.trusthire.employer.controller;

import com.trusthire.employer.entity.EmployerProfile;
import com.trusthire.employer.service.EmployerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employer/profile")
@RequiredArgsConstructor
public class EmployerProfileController {

    private final EmployerProfileService profileService;

    @GetMapping
    public ResponseEntity<EmployerProfile> getProfile(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        EmployerProfile profile = profileService.getProfileByUserId(userId)
                .orElseGet(() -> profileService.createProfile(userId));
        return ResponseEntity.ok(profile);
    }

    @RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<EmployerProfile> createOrUpdateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody EmployerProfile profileRequest) {
        
        String userId = jwt.getSubject();
        EmployerProfile profile = profileService.getProfileByUserId(userId)
                .orElseGet(() -> profileService.createProfile(userId));

        if (profileRequest.getCompanyName() != null) profile.setCompanyName(profileRequest.getCompanyName());
        if (profileRequest.getIndustry() != null) profile.setIndustry(profileRequest.getIndustry());
        if (profileRequest.getCompanyWebsite() != null) profile.setCompanyWebsite(profileRequest.getCompanyWebsite());
        if (profileRequest.getProfileBio() != null) profile.setProfileBio(profileRequest.getProfileBio());
        if (profileRequest.getBusinessTier() != null) profile.setBusinessTier(profileRequest.getBusinessTier());
        if (profileRequest.getLocation() != null) profile.setLocation(profileRequest.getLocation());
        if (profileRequest.getLatitude() != null) profile.setLatitude(profileRequest.getLatitude());
        if (profileRequest.getLongitude() != null) profile.setLongitude(profileRequest.getLongitude());
        if (profileRequest.getAddress() != null) profile.setAddress(profileRequest.getAddress());
        if (profileRequest.getCity() != null) profile.setCity(profileRequest.getCity());

        return ResponseEntity.ok(profileService.updateProfile(profile));
    }
}
