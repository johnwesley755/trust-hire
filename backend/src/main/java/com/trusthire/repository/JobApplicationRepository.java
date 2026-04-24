package com.trusthire.repository;

import com.trusthire.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
    List<JobApplication> findByWorkerId(String workerId);
    List<JobApplication> findByJobId(UUID jobId);
    Optional<JobApplication> findByJobIdAndWorkerId(UUID jobId, String workerId);
    List<JobApplication> findByJobIdIn(List<UUID> jobIds);
}
