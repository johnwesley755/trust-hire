package com.trusthire.job.service;

import com.trusthire.job.entity.Job;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobService {
    Job createJob(Job job);
    List<Job> getAllJobs();
    Optional<Job> getJobById(UUID id);
    List<Job> getJobsByEmployer(String employerId);
    Job updateJob(Job job);
    void deleteJob(UUID id);
    Double calculateMatchScore(UUID jobId, String workerProfile, java.util.List<String> workerSkills);
}
