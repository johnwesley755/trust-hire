package com.trusthire.worker.service;

import com.trusthire.worker.dto.ProfileCompletionStatus;
import com.trusthire.worker.dto.WorkerProfileSummary;
import com.trusthire.worker.entity.WorkerProfile;
import java.util.List;
import java.util.Optional;

public interface WorkerProfileService {
    Optional<WorkerProfile> getProfileByUserId(String userId);
    WorkerProfile updateProfile(WorkerProfile profile);
    WorkerProfile createProfile(String userId);
    ProfileCompletionStatus getProfileCompletionStatus(String userId);
    List<WorkerProfileSummary> getProfileSummariesByUserIds(List<String> userIds);
}
