package com.trusthire.rating.repository;

import com.trusthire.rating.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {
    List<Rating> findByRateeId(String rateeId);
    List<Rating> findByReviewerId(String reviewerId);
    List<Rating> findByJobId(UUID jobId);
}
