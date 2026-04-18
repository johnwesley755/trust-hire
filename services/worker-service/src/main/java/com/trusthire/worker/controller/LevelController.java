package com.trusthire.worker.controller;

import com.trusthire.worker.entity.WorkerProfile;
import com.trusthire.worker.repository.WorkerProfileRepository;
import com.trusthire.worker.service.LevelCalculationService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/levels")
@RequiredArgsConstructor
public class LevelController {

    private final LevelCalculationService levelCalculationService;
    private final WorkerProfileRepository workerRepository;

    @GetMapping("/worker/{userId}")
    public ResponseEntity<LevelDetails> getLevelDetails(@PathVariable String userId) {
        WorkerProfile worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        return ResponseEntity.ok(LevelDetails.builder()
                .workerId(userId)
                .currentLevel(worker.getLevelNumber())
                .levelScore(worker.getLevelScore().intValue())
                .components(LevelComponents.builder()
                        .skillScore(worker.getSkillScore().intValue())
                        .experienceScore(worker.getExperienceScore().intValue())
                        .performanceScore(worker.getPerformanceScore().intValue())
                        .reliabilityScore(worker.getReliabilityScore().intValue())
                        .build())
                .nextLevel(worker.getLevelNumber() < 4 ? worker.getLevelNumber() + 1 : 4)
                .salaryRange(getSalaryRange(worker.getLevelNumber()))
                .build());
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<LevelProgress> getLevelProgress(@PathVariable String userId) {
        WorkerProfile worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        return ResponseEntity.ok(LevelProgress.builder()
                .currentLevel(worker.getLevelNumber())
                .levelScore(worker.getLevelScore().intValue())
                .nextLevel(worker.getLevelNumber() < 4 ? worker.getLevelNumber() + 1 : 4)
                .progress(calculateProgress(worker))
                .build());
    }

    private String getSalaryRange(int level) {
        return switch (level) {
            case 1 -> "₹8,000 - ₹12,000";
            case 2 -> "₹12,000 - ₹18,000";
            case 3 -> "₹18,000 - ₹25,000";
            case 4 -> "₹25,000+";
            default -> "N/A";
        };
    }

    private double calculateProgress(WorkerProfile worker) {
        int currentLevel = worker.getLevelNumber();
        double score = worker.getLevelScore();
        if (currentLevel == 4) return 100.0;
        
        int min = currentLevel == 1 ? 0 : (currentLevel == 2 ? 41 : 66);
        int max = currentLevel == 1 ? 40 : (currentLevel == 2 ? 65 : 85);
        
        return ((score - min) / (max - min)) * 100;
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
