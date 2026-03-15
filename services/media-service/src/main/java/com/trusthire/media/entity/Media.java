package com.trusthire.media.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Media {
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

    @Column(nullable = false)
    private String ownerId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
