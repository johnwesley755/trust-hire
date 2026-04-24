package com.trusthire.repository;

import com.trusthire.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, UUID> {
    Optional<WorkerProfile> findByUserId(String userId);
    List<WorkerProfile> findByUserIdIn(List<String> userIds);
    long count();
}
