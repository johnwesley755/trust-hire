package com.trusthire.repository;

import com.trusthire.entity.UserMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserMetadataRepository extends JpaRepository<UserMetadata, UUID> {

    Optional<UserMetadata> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<UserMetadata> findByResetToken(String resetToken);

    List<UserMetadata> findByIdIn(List<UUID> ids);
}
