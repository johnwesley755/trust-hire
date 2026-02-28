package com.trusthire.search.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "worker_search_index")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerSearch {
    @Id
    private String clerkId; // Maps to Clerk User ID

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String skills; // Comma separated skills e.g., "Plumbing, Electrician"
    private String location;
    private String level; // L1, L2, L3, L4
    private Boolean isVerified;
    private String profileImageUrl;
    private String status; // AVAILABLE, BUSY

    @CreationTimestamp
    private LocalDateTime indexedAt;

    @UpdateTimestamp
    private LocalDateTime lastUpdatedAt;
}
