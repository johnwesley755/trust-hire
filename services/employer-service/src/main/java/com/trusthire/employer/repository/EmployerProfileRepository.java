package com.trusthire.employer.repository;

import com.trusthire.employer.entity.EmployerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, UUID> {
    Optional<EmployerProfile> findByClerkId(String clerkId);
}
