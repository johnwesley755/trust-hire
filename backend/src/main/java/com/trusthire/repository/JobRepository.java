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
    long count();
}
