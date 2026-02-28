package com.trusthire.identity.repository;

import com.trusthire.identity.entity.EmployerProfile;
import com.trusthire.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, UUID> {
    Optional<EmployerProfile> findByUser(User user);
    Optional<EmployerProfile> findByUserClerkId(String clerkId);
}
