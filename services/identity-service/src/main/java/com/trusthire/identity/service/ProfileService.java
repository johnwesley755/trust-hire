package com.trusthire.identity.service;

import com.trusthire.identity.entity.EmployerProfile;
import com.trusthire.identity.entity.WorkerProfile;
import com.trusthire.identity.repository.EmployerProfileRepository;
import com.trusthire.identity.repository.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final EmployerProfileRepository employerProfileRepository;
    private final WorkerProfileRepository workerProfileRepository;

    public EmployerProfile getEmployerProfile(String clerkId) {
        return employerProfileRepository.findByUserClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("Employer profile not found"));
    }

    public WorkerProfile getWorkerProfile(String clerkId) {
        return workerProfileRepository.findByUserClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
    }

    @Transactional
    public EmployerProfile updateEmployerProfile(String clerkId, EmployerProfile updates) {
        EmployerProfile profile = getEmployerProfile(clerkId);
        if (updates.getCompanyName() != null) profile.setCompanyName(updates.getCompanyName());
        if (updates.getIndustry() != null) profile.setIndustry(updates.getIndustry());
        if (updates.getCompanyWebsite() != null) profile.setCompanyWebsite(updates.getCompanyWebsite());
        if (updates.getProfileBio() != null) profile.setProfileBio(updates.getProfileBio());
        return employerProfileRepository.save(profile);
    }

    @Transactional
    public WorkerProfile updateWorkerProfile(String clerkId, WorkerProfile updates) {
        WorkerProfile profile = getWorkerProfile(clerkId);
        if (updates.getFullName() != null) profile.setFullName(updates.getFullName());
        if (updates.getBio() != null) profile.setBio(updates.getBio());
        if (updates.getLocation() != null) profile.setLocation(updates.getLocation());
        if (updates.getSkills() != null) profile.setSkills(updates.getSkills());
        if (updates.getExperienceYears() != null) profile.setExperienceYears(updates.getExperienceYears());
        if (updates.getHourlyRate() != null) profile.setHourlyRate(updates.getHourlyRate());
        if (updates.getIsAvailable() != null) profile.setIsAvailable(updates.getIsAvailable());
        return workerProfileRepository.save(profile);
    }
}
