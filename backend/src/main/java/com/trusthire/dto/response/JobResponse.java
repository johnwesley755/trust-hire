package com.trusthire.dto.response;

import com.trusthire.entity.Job;
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
public class JobResponse {
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
    
    private boolean isApplied;

    public static JobResponse fromEntity(Job job, boolean isApplied) {
        return JobResponse.builder()
                .id(job.getId())
                .employerId(job.getEmployerId())
                .title(job.getTitle())
                .description(job.getDescription())
                .industry(job.getIndustry())
                .requiredSkills(job.getRequiredSkills())
                .experienceYearsRequired(job.getExperienceYearsRequired())
                .budget(job.getBudget())
                .location(job.getLocation())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .address(job.getAddress())
                .city(job.getCity())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .isApplied(isApplied)
                .build();
    }
}
