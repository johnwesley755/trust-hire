package com.trusthire.worker.controller;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/levels")
@RequiredArgsConstructor
public class LevelController {

    @GetMapping("/worker/{clerkId}")
    public ResponseEntity<LevelDetails> getLevelDetails(@PathVariable String clerkId) {
        // Mock data logic for now, connecting to real profile data
        return ResponseEntity.ok(LevelDetails.builder()
                .workerId(clerkId)
                .currentLevel(1)
                .levelScore(450)
                .components(LevelComponents.builder()
                        .skillScore(120)
                        .experienceScore(100)
                        .performanceScore(150)
                        .reliabilityScore(80)
                        .build())
                .nextLevel(2)
                .pointsToNextLevel(550)
                .salaryRange("₹15,000 - ₹25,000")
                .achievements(Arrays.asList("Quick Learner", "Highly Reliable"))
                .build());
    }

    @GetMapping("/progress/{clerkId}")
    public ResponseEntity<LevelProgress> getLevelProgress(@PathVariable String clerkId) {
        return ResponseEntity.ok(LevelProgress.builder()
                .currentLevel(1)
                .levelScore(450)
                .nextLevel(2)
                .progress(45.0)
                .recommendations(Arrays.asList("Complete 2 more Skill Tests", "Maintain 95% punctuality"))
                .estimatedTime("2 weeks")
                .build());
    }

    @Data @Builder
    public static class LevelDetails {
        private String workerId;
        private int currentLevel;
        private int levelScore;
        private LevelComponents components;
        private int nextLevel;
        private int pointsToNextLevel;
        private String salaryRange;
        private List<String> achievements;
    }

    @Data @Builder
    public static class LevelComponents {
        private int skillScore;
        private int experienceScore;
        private int performanceScore;
        private int reliabilityScore;
    }

    @Data @Builder
    public static class LevelProgress {
        private int currentLevel;
        private int levelScore;
        private int nextLevel;
        private double progress;
        private List<String> recommendations;
        private String estimatedTime;
    }
}
