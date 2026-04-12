package com.trusthire.job.dto;

import com.trusthire.job.entity.Job;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponseDTO {
    private UUID id;
    private String employerId;
    private String title;
    private String description;
    private String industry;
    private List<String> requiredSkills;
    private Integer experienceYearsRequired;
    private BigDecimal budget;
    private String location;
    private Double latitude;
    private Double longitude;
    private String address;
    private String city;
    private Job.JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Status flag
    private boolean isApplied;
}
