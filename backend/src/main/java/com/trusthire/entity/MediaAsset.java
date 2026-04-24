package com.trusthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String publicId;

    private String fileName;
    private String fileType; // IMAGE, DOCUMENT, etc.
    private Long fileSize;

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
