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
           "(:lat = -999.0 OR :lon = -999.0 OR :radius = -999.0 OR " +
           "(6371 * acos(cos(radians(cast(:lat as double))) * cos(radians(w.latitude)) * cos(radians(w.longitude) - radians(cast(:lon as double))) + sin(radians(cast(:lat as double))) * sin(radians(w.latitude))) <= cast(:radius as double)))")
    List<WorkerSearch> searchWorkers(
            @Param("query") String query, 
            @Param("location") String location, 
            @Param("level") String level,
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius);
}
