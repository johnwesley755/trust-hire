package com.trusthire.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSearchResponseDTO {
    private UUID jobId;
    private String title;
    private String description;
    private String industry;
    private java.util.List<String> requiredSkills;
    private java.math.BigDecimal budget;
    private String location;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;
    private String level;
    private String status;
    private LocalDateTime indexedAt;
    private LocalDateTime lastUpdatedAt;
    
    // Enrichment field
    private boolean isApplied;
}
