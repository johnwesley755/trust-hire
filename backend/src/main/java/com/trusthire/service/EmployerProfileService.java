package com.trusthire.service;

import com.trusthire.entity.EmployerProfile;
import java.util.Optional;

public interface EmployerProfileService {
    Optional<EmployerProfile> getProfileByUserId(String userId);
    EmployerProfile createProfile(String userId, EmployerProfile profile);
    EmployerProfile updateProfile(String userId, EmployerProfile updates);
}
