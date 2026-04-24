package com.trusthire.repository;

import com.trusthire.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {
    List<Rating> findByRateeId(String rateeId);
    List<Rating> findByReviewerId(String reviewerId);
    
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.rateeId = :rateeId")
    Double getAverageRating(@Param("rateeId") String rateeId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.rateeId = :rateeId")
    Integer getRatingCount(@Param("rateeId") String rateeId);
}
