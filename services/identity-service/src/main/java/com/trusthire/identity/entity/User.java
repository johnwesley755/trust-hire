package com.trusthire.identity.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String clerkId; // Primary Key from Clerk

    @Column(nullable = false)
    private String email;

    private String firstName;
    private String lastName;
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private boolean emailVerified;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum UserRole {
        WORKER, EMPLOYER, ADMIN
    }
}
