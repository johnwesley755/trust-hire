package com.trusthire.job.service;

import com.trusthire.job.entity.Job;
import com.trusthire.job.dto.JobResponseDTO;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobService {
    Job createJob(Job job);
    List<Job> getAllJobs();
    List<JobResponseDTO> getAllJobsEnriched(String workerId);
    List<Job> getJobsByIds(List<UUID> ids);
    Optional<Job> getJobById(UUID id);
    Optional<JobResponseDTO> getJobByIdEnriched(UUID id, String workerId);
    List<Job> getJobsByEmployer(String employerId);
    Job updateJob(Job job);
    void deleteJob(UUID id);
    Double calculateMatchScore(UUID jobId, String workerProfile, java.util.List<String> workerSkills);
    com.trusthire.job.dto.StatsDTO getGlobalStats();
}
