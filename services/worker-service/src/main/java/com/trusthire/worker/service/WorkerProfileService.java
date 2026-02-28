package com.trusthire.worker.service;

import com.trusthire.worker.entity.WorkerProfile;
import java.util.Optional;

public interface WorkerProfileService {
    Optional<WorkerProfile> getProfileByClerkId(String clerkId);
    WorkerProfile updateProfile(WorkerProfile profile);
    WorkerProfile createProfile(String clerkId);
}
