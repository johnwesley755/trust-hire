package com.trusthire.identity.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "worker_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "clerk_id", referencedColumnName = "clerkId", nullable = false)
    private User user;

    private String fullName;
    private String location;
    private String level; // L1, L2, L3, L4

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection
    @CollectionTable(name = "worker_skills", joinColumns = @JoinColumn(name = "worker_id"))
    @Column(name = "skill")
    private List<String> skills;

    private Integer experienceYears;

    @Column(precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    private Boolean isAvailable;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
