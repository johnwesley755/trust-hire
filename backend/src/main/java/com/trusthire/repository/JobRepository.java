package com.trusthire.repository;

import com.trusthire.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByEmployerId(String employerId);
    List<Job> findByIdIn(List<UUID> ids);
    List<Job> findByStatus(Job.JobStatus status);
    List<Job> findByStatusAndCreatedAtBefore(Job.JobStatus status, java.time.LocalDateTime dateTime);
    long countByEmployerIdAndStatus(String employerId, Job.JobStatus status);
    long count();
}
