package com.trusthire.verification.repository;

import com.trusthire.verification.entity.VerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationRepository extends JpaRepository<VerificationRecord, UUID> {
    Optional<VerificationRecord> findByWorkerClerkId(String workerClerkId);
}
