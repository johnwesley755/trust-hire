package com.trusthire.service;

import com.trusthire.dto.response.ProfileCompletionStatus;
import com.trusthire.dto.response.WorkerProfileSummary;
import com.trusthire.entity.WorkerProfile;

import java.util.List;
import java.util.Optional;

public interface WorkerProfileService {
    Optional<WorkerProfile> getProfileByUserId(String userId);
    WorkerProfile createProfile(String userId);
    WorkerProfile updateProfile(WorkerProfile profile);
    ProfileCompletionStatus getProfileCompletionStatus(String userId);
    List<WorkerProfileSummary> getProfileSummariesByUserIds(List<String> userIds);
    void incrementProfileViews(String userId);
    long getTotalWorkersCount();
    
    Double getAverageRating(String userId);
    int getRatingCount(String userId);
    int getTrustScore(String userId);
    int getVerifiedSkillsCount(String userId);
}
