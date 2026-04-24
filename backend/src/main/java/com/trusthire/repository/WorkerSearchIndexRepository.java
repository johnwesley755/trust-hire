package com.trusthire.repository;

import com.trusthire.entity.WorkerSearchIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerSearchIndexRepository extends JpaRepository<WorkerSearchIndex, String> {

    @Query("SELECT w FROM WorkerSearchIndex w WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(w.bio) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(w.skills) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:level IS NULL OR :level = '' OR w.level = :level) AND " +
           "(:city IS NULL OR :city = '' OR LOWER(w.city) = LOWER(:city)) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(w.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:lat = -999.0 OR :lon = -999.0 OR :radius = -999.0 OR " +
           "(6371 * acos(cos(radians(cast(:lat as double))) * cos(radians(w.latitude)) * cos(radians(w.longitude) - radians(cast(:lon as double))) + sin(radians(cast(:lat as double))) * sin(radians(w.latitude))) <= cast(:radius as double)))")
    List<WorkerSearchIndex> searchWorkers(
            @Param("query") String query,
            @Param("level") String level,
            @Param("location") String location,
            @Param("city") String city,
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius);
}
