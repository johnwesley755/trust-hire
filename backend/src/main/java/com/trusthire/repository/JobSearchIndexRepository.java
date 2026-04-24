package com.trusthire.repository;

import com.trusthire.entity.JobSearchIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobSearchIndexRepository extends JpaRepository<JobSearchIndex, UUID> {
    
    @Query("SELECT j FROM JobSearchIndex j WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(j.industry) = LOWER(:category)) AND " +
           "(:city IS NULL OR :city = '' OR LOWER(j.city) = LOWER(:city)) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:lat = -999.0 OR :lon = -999.0 OR :radius = -999.0 OR " +
           "(6371 * acos(cos(radians(cast(:lat as double))) * cos(radians(j.latitude)) * cos(radians(j.longitude) - radians(cast(:lon as double))) + sin(radians(cast(:lat as double))) * sin(radians(j.latitude))) <= cast(:radius as double)))")
    List<JobSearchIndex> searchJobs(
            @Param("query") String query, 
            @Param("category") String category, 
            @Param("location") String location,
            @Param("city") String city,
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius);
}
