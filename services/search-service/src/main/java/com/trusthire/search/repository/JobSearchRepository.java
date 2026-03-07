package com.trusthire.search.repository;

import com.trusthire.search.entity.JobSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobSearchRepository extends JpaRepository<JobSearch, UUID> {
    
    @Query("SELECT j FROM JobSearch j WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(j.industry) = LOWER(:category)) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:lat IS NULL OR :lon IS NULL OR :radius IS NULL OR " +
           "(6371 * acos(cos(radians(CAST(:lat AS Double))) * cos(radians(j.latitude)) * cos(radians(j.longitude) - radians(CAST(:lon AS Double))) + sin(radians(CAST(:lat AS Double))) * sin(radians(j.latitude))) <= CAST(:radius AS Double)))")
    List<JobSearch> searchJobs(
            @Param("query") String query, 
            @Param("category") String category, 
            @Param("location") String location,
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius);
}
