package com.trusthire.repository;

import com.trusthire.entity.VerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationRecordRepository extends JpaRepository<VerificationRecord, UUID> {
    Optional<VerificationRecord> findByUserId(String userId);
}
