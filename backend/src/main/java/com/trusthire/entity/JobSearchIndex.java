package com.trusthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_search_index")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSearchIndex {
    @Id
    private UUID jobId;

    @Column(nullable = false)
    private String title;

    private String employerName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category")
    private String industry;
    
    private String location;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;
    private String level;
    
    @Column(name = "required_skills")
    private String requiredSkills;
    
    private Double budget;
    private String status;

    @CreationTimestamp
    private LocalDateTime indexedAt;

    @UpdateTimestamp
    private LocalDateTime lastUpdatedAt;
}
