package com.trusthire.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "worker_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String userId;

    private String fullName;
    private String bio;
    
    @Column(columnDefinition = "TEXT")
    private String skills;
    
    private Integer experienceYears;
    @Column(length = 50)
    private String level; // L1, L2, L3, L4
    
    @Builder.Default
    @Column(name = "level_number")
    private Integer levelNumber = 1;

    @Builder.Default
    @Column(name = "skill_score")
    private Double skillScore = 30.0;

    @Builder.Default
    @Column(name = "experience_score")
    private Double experienceScore = 0.0;

    @Builder.Default
    @Column(name = "performance_score")
    private Double performanceScore = 0.0;

    @Builder.Default
    @Column(name = "reliability_score")
    private Double reliabilityScore = 0.0;

    @Builder.Default
    @Column(name = "level_score")
    private Double levelScore = 0.0;

    @Builder.Default
    @Column(name = "trust_score")
    private Integer trustScore = 0;

    @Builder.Default
    private Integer totalJobs = 0;

    @Builder.Default
    private Integer completedJobs = 0;

    @Builder.Default
    private Integer abscondCount = 0;

    @Column(precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Builder.Default
    private Long profileViews = 0L;

    @Builder.Default
    private Boolean isAvailable = true;

    private String location;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isAvailable == null) isAvailable = true;
        if (profileViews == null) profileViews = 0L;
        if (levelNumber == null) levelNumber = 1;
        if (skillScore == null) skillScore = 30.0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
