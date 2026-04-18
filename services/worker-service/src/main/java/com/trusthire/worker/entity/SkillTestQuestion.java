package com.trusthire.worker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "skill_test_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillTestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private SkillTest test;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private List<String> options;

    @Column(nullable = false)
    private Integer correctOption; // 0-indexed

    private Integer points = 10;

    @Column(name = "complexity_score")
    private Integer complexityScore = 1;

    @JdbcTypeCode(SqlTypes.JSON)
    private String metadata; // Changed to String for simpler initial handling of JSONB
}
