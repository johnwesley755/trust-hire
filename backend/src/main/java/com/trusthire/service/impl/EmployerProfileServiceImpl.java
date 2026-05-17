package com.trusthire.service.impl;

import com.trusthire.entity.EmployerProfile;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.repository.EmployerProfileRepository;
import com.trusthire.repository.UserMetadataRepository;
import com.trusthire.service.EmployerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployerProfileServiceImpl implements EmployerProfileService {

    private final EmployerProfileRepository profileRepository;
    private final UserMetadataRepository userRepository;
    private final com.trusthire.service.ActivityService activityService;

    @Override
    @Transactional
    public Optional<EmployerProfile> getProfileByUserId(String userId) {
        Optional<EmployerProfile> profileOpt = profileRepository.findByUserId(userId);
        final EmployerProfile profile = profileOpt.orElseGet(() -> {
            EmployerProfile newProfile = EmployerProfile.builder()
                    .userId(userId)
                    .companyName("My Company")
                    .build();
            return profileRepository.save(newProfile);
        });

        // Fetch UserMetadata to get the profile image and verification status
        userRepository.findById(UUID.fromString(userId)).ifPresent(user -> {
            profile.setProfileImageUrl(user.getProfileImageUrl());
            profile.setIsVerified(user.getIdentityVerified() != null && user.getIdentityVerified());
        });

        return Optional.of(profile);
    }

    @Override
    @Transactional
    public EmployerProfile createProfile(String userId, EmployerProfile profile) {
        profile.setUserId(userId);
        EmployerProfile saved = profileRepository.save(profile);
        userRepository.findById(UUID.fromString(userId)).ifPresent(user -> {
            saved.setProfileImageUrl(user.getProfileImageUrl());
            saved.setIsVerified(user.getIdentityVerified() != null && user.getIdentityVerified());
        });

        activityService.logActivity(
            userId,
            "PROFILE_CREATED",
            "Employer account and company profile created",
            saved.getId().toString()
        );
        return saved;
    }

    @Override
    @Transactional
    public EmployerProfile updateProfile(String userId, EmployerProfile updates) {
        EmployerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found for user: " + userId));

        if (updates.getCompanyName() != null) profile.setCompanyName(updates.getCompanyName());
        if (updates.getIndustry() != null) profile.setIndustry(updates.getIndustry());
        if (updates.getCompanyWebsite() != null) profile.setCompanyWebsite(updates.getCompanyWebsite());
        if (updates.getProfileBio() != null) profile.setProfileBio(updates.getProfileBio());
        if (updates.getBusinessTier() != null) profile.setBusinessTier(updates.getBusinessTier());
        if (updates.getLocation() != null) profile.setLocation(updates.getLocation());
        if (updates.getCity() != null) profile.setCity(updates.getCity());
        if (updates.getAddress() != null) profile.setAddress(updates.getAddress());
        if (updates.getLatitude() != null) profile.setLatitude(updates.getLatitude());
        if (updates.getLongitude() != null) profile.setLongitude(updates.getLongitude());

        EmployerProfile saved = profileRepository.save(profile);
        userRepository.findById(UUID.fromString(userId)).ifPresent(user -> {
            saved.setProfileImageUrl(user.getProfileImageUrl());
            saved.setIsVerified(user.getIdentityVerified() != null && user.getIdentityVerified());
        });

        activityService.logActivity(
            userId,
            "PROFILE_UPDATED",
            "Company profile and business details updated",
            saved.getId().toString()
        );
        return saved;
    }
}
