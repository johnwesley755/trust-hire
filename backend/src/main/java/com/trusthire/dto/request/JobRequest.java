package com.trusthire.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class JobRequest {
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
    private String status;

    /**
     * Employer-specified expiry date (date only, no time).
     * The service layer converts this to LocalDateTime at end-of-day.
     * Optional — if omitted, the job will not have an automatic expiry date.
     */
    private LocalDate expiresAt;
}
