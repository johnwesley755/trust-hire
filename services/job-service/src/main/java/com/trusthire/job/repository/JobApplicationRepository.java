package com.trusthire.job.repository;

import com.trusthire.job.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
    List<JobApplication> findByJobId(UUID jobId);
    List<JobApplication> findByJobIdIn(List<UUID> jobIds);
    List<JobApplication> findByWorkerId(String workerId);
    Optional<JobApplication> findByJobIdAndWorkerId(UUID jobId, String workerId);
    boolean existsByJobIdAndWorkerId(UUID jobId, String workerId);
    long countByJobId(UUID jobId);
}
