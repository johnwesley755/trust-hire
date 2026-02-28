package com.trusthire.search.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_search_index")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSearch {
    @Id
    private UUID jobId; // Maps to Job entity in job-service

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String industry;
    private String location;
    private java.math.BigDecimal budget;
    private String requiredSkills; // Comma separated for indexing
    private String employerClerkId;
    private String status;

    @CreationTimestamp
    private LocalDateTime indexedAt;

    @UpdateTimestamp
    private LocalDateTime lastUpdatedAt;
}
