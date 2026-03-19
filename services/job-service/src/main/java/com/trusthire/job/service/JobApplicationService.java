package com.trusthire.job.service;

import com.trusthire.job.entity.JobApplication;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobApplicationService {
    JobApplication applyForJob(JobApplication application);
    List<JobApplication> getApplicationsByJob(UUID jobId);
    List<JobApplication> getApplicationsByJobIds(List<UUID> jobIds);
    List<JobApplication> getApplicationsByWorker(String workerId);
    JobApplication updateApplicationStatus(UUID id, JobApplication.ApplicationStatus status);
    Optional<JobApplication> getApplicationById(UUID id);
    java.util.Map<UUID, Long> getApplicationCountsByJobIds(List<UUID> jobIds);
}
