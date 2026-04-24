package com.trusthire.service;

import com.trusthire.entity.JobApplication;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface JobApplicationService {
    JobApplication applyForJob(String workerId, UUID jobId, String coverLetter);
    List<JobApplication> getMyApplications(String workerId);
    List<JobApplication> getApplicationsForJob(UUID jobId, String employerId);
    List<JobApplication> getApplicationsByJobIds(List<UUID> jobIds);
    Map<UUID, Long> getApplicationCountsByJobIds(List<UUID> jobIds);
    JobApplication updateApplicationStatus(UUID id, JobApplication.ApplicationStatus status, String userId);
}
