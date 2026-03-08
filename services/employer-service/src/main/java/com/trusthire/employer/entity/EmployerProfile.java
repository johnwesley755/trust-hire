package com.trusthire.employer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employer_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployerProfile {
    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String userId;

    private String companyName;
    private String industry;
    private String companyWebsite;
    
    @Column(columnDefinition = "TEXT")
    private String profileBio;

    private String businessTier; // e.g., "Silver", "Gold", "Platinum"
    
    private String location;
    private Double latitude;
    private Double longitude;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isVerified;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
