package com.trusthire.worker.controller;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skill-tests")
@RequiredArgsConstructor
public class SkillTestController {

    @GetMapping("/available")
    public ResponseEntity<List<SkillTest>> getAvailableTests(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(Arrays.asList(
                SkillTest.builder()
                        .id(UUID.randomUUID())
                        .title("Basic Electrical Safety")
                        .category("Electrical")
                        .difficulty("Beginner")
                        .durationMinutes(20)
                        .points(100)
                        .description("Essential safety protocols for residential electrical work.")
                        .build(),
                SkillTest.builder()
                        .id(UUID.randomUUID())
                        .title("Advanced Culinary Techniques")
                        .category("Cooking")
                        .difficulty("Advanced")
                        .durationMinutes(45)
                        .points(300)
                        .description("Mastery of industrial kitchen operations and hygiene.")
                        .build()
        ));
    }

    @PostMapping("/submit")
    public ResponseEntity<TestResult> submitResult(@RequestBody TestSubmission submission) {
        return ResponseEntity.ok(TestResult.builder()
                .testId(submission.getTestId())
                .score(85)
                .passed(true)
                .pointsEarned(submission.getMaxPoints() * 85 / 100)
                .feedback("Excellent understanding of safety protocols.")
                .build());
    }

    @Data @Builder
    public static class SkillTest {
        private UUID id;
        private String title;
        private String category;
        private String difficulty;
        private int durationMinutes;
        private int points;
        private String description;
    }

    @Data
    public static class TestSubmission {
        private UUID testId;
        private String clerkId;
        private List<Object> answers;
        private int maxPoints;
    }

    @Data @Builder
    public static class TestResult {
        private UUID testId;
        private int score;
        private boolean passed;
        private int pointsEarned;
        private String feedback;
    }
}
