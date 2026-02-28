package com.trusthire.identity.repository;

import com.trusthire.identity.entity.User;
import com.trusthire.identity.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, UUID> {
    Optional<WorkerProfile> findByUser(User user);
    Optional<WorkerProfile> findByUserClerkId(String clerkId);
}
