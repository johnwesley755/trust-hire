package com.trusthire.service.impl;

import com.trusthire.entity.EmployerProfile;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.repository.EmployerProfileRepository;
import com.trusthire.service.EmployerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployerProfileServiceImpl implements EmployerProfileService {

    private final EmployerProfileRepository profileRepository;

    @Override
    public Optional<EmployerProfile> getProfileByUserId(String userId) {
        return profileRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public EmployerProfile createProfile(String userId, EmployerProfile profile) {
        profile.setUserId(userId);
        return profileRepository.save(profile);
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

        return profileRepository.save(profile);
    }
}
