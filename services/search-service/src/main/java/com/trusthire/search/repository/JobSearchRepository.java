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
           "(:query IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR j.category = :category) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(j.status = 'OPEN')")
    List<JobSearch> searchJobs(
            @Param("query") String query,
            @Param("category") String category,
            @Param("location") String location);
}
