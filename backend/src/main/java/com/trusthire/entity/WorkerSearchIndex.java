package com.trusthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "worker_search_index")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerSearchIndex {
    @Id
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String skills;
    private String location;
    private String city;
    private Double latitude;
    private Double longitude;
    private String level;
    private Boolean isVerified;
    private String profileImageUrl;
    private String status;
    private Integer trustScore;

    @CreationTimestamp
    private LocalDateTime indexedAt;

    @UpdateTimestamp
    private LocalDateTime lastUpdatedAt;
}
