package com.trusthire.verification.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verification_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String userId;

    private String docImageUrl; // Aadhaar/ID photo URL
    private String liveImageUrl; // Live capture photo URL

    @Enumerated(EnumType.STRING)
    private VerificationStatus status;

    private String confidenceScore; // If we use an AI service later
    private String failureReason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        NONE, PENDING, VERIFIED, REJECTED
    }
}
