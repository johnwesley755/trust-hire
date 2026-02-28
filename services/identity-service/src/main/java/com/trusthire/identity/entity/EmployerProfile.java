package com.trusthire.identity.entity;

import jakarta.persistence.*;
import lombok.*;
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
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "clerk_id", referencedColumnName = "clerkId", nullable = false)
    private User user;

    private String companyName;
    private String industry;
    private String companyWebsite;

    @Column(columnDefinition = "TEXT")
    private String profileBio;

    private String businessTier; // Silver, Gold, Platinum
    private boolean isVerified;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
