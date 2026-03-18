package com.trusthire.auth.repository;

import com.trusthire.auth.entity.UserMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserMetadataRepository extends JpaRepository<UserMetadata, UUID> {
    Optional<UserMetadata> findByEmail(String email);
    Optional<UserMetadata> findByPhoneNumber(String phoneNumber);
    List<UserMetadata> findByIdIn(List<UUID> ids);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
}
