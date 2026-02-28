package com.trusthire.employer.service;

import com.trusthire.employer.entity.EmployerProfile;
import java.util.Optional;

public interface EmployerProfileService {
    Optional<EmployerProfile> getProfileByClerkId(String clerkId);
    EmployerProfile updateProfile(EmployerProfile profile);
    EmployerProfile createProfile(String clerkId);
}
