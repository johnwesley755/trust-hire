package com.trusthire.repository;

import com.trusthire.entity.EarlyAccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EarlyAccessRepository extends JpaRepository<EarlyAccessRequest, UUID> {
    Optional<EarlyAccessRequest> findByEmailAndSource(String email, String source);
}
