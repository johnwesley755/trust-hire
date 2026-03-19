package com.trusthire.job.repository;

import com.trusthire.job.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByEmployerId(String employerId);
    List<Job> findByStatus(Job.JobStatus status);
    List<Job> findByIdIn(List<UUID> ids);
    long countByCreatedAtAfter(LocalDateTime createdAt);
}
