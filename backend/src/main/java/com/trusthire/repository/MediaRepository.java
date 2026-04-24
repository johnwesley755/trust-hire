package com.trusthire.repository;

import com.trusthire.entity.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaRepository extends JpaRepository<MediaAsset, UUID> {
    List<MediaAsset> findByOwnerId(String ownerId);
}
