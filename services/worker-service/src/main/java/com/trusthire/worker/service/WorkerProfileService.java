package com.trusthire.worker.service;

import com.trusthire.worker.entity.WorkerProfile;
import java.util.Optional;

public interface WorkerProfileService {
    Optional<WorkerProfile> getProfileByUserId(String userId);
    WorkerProfile updateProfile(WorkerProfile profile);
    WorkerProfile createProfile(String userId);
}
