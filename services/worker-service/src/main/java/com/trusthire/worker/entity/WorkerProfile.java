package com.trusthire.worker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
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
    private String location;
    private Double latitude;
    private Double longitude;
    private String level; // L1, L2, L3, L4
    private String address;
    private String city;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String skills;

    private Integer experienceYears;
    
    @Column(name = "skill_score")
    private Double skillScore = 30.0;

    @Column(name = "experience_score")
    private Double experienceScore = 0.0;

    @Column(name = "performance_score")
    private Double performanceScore = 0.0;

    @Column(name = "reliability_score")
    private Double reliabilityScore = 0.0;

    @Column(name = "level_score")
    private Double levelScore = 0.0;

    @Column(name = "trust_score")
    private Integer trustScore = 0;

    @Column(name = "level_number")
    private Integer levelNumber = 1;

    @Column(precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    private Long profileViews;

    private Boolean isAvailable;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isAvailable == null) isAvailable = true;
        if (profileViews == null) profileViews = 0L;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
