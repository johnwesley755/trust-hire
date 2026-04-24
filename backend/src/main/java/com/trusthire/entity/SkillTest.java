package com.trusthire.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "skill_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillTest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "varchar(255) default 'Intermediate'")
    private String difficulty = "Intermediate";

    @Builder.Default
    @Column(nullable = false, columnDefinition = "integer default 30")
    private Integer durationMinutes = 30;

    @Builder.Default
    private Integer points = 100;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkillTestQuestion> questions;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
