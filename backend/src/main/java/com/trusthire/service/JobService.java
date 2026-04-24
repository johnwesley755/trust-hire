package com.trusthire.service;

import com.trusthire.dto.response.JobResponse;
import com.trusthire.entity.Job;
import java.util.List;
import java.util.UUID;

public interface JobService {
    Job createJob(String employerId, Job job);
    List<JobResponse> getAllJobs(String currentUserId);
    JobResponse getJobById(UUID id, String currentUserId);
    List<Job> getJobsByEmployer(String employerId);
    Job updateJob(UUID id, String employerId, Job updates);
    void deleteJob(UUID id, String employerId);
    List<Job> getJobsByIds(List<UUID> ids);
    long getTotalJobsCount();
}
