package com.trusthire.search.repository;

import com.trusthire.search.entity.WorkerSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerSearchRepository extends JpaRepository<WorkerSearch, String> {
    
    @Query("SELECT w FROM WorkerSearch w WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(w.skills) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(w.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:level IS NULL OR :level = '' OR w.level = :level) AND " +
           "(:lat IS NULL OR :lon IS NULL OR :radius IS NULL OR " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(w.latitude)) * cos(radians(w.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(w.latitude))) <= :radius))")
    List<WorkerSearch> searchWorkers(
            @Param("query") String query, 
            @Param("location") String location, 
            @Param("level") String level,
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius);
}
