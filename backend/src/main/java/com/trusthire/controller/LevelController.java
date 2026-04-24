package com.trusthire.controller;

import com.trusthire.dto.response.LevelDetailsResponse;
import com.trusthire.dto.response.LevelProgressResponse;
import com.trusthire.entity.WorkerProfile;
import com.trusthire.repository.WorkerProfileRepository;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/levels")
@RequiredArgsConstructor
public class LevelController {

    private final WorkerProfileRepository workerRepository;

    @GetMapping("/worker/{userId}")
    public ResponseEntity<ApiResponse<LevelDetailsResponse>> getLevelDetails(@PathVariable String userId) {
        WorkerProfile worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        return ResponseEntity.ok(ApiResponse.ok(LevelDetailsResponse.builder()
                .workerId(userId)
                .currentLevel(worker.getLevelNumber())
                .levelScore(worker.getLevelScore().intValue())
                .components(LevelDetailsResponse.LevelComponents.builder()
                        .skillScore(worker.getSkillScore().intValue())
                        .experienceScore(worker.getExperienceScore().intValue())
                        .performanceScore(worker.getPerformanceScore().intValue())
                        .reliabilityScore(worker.getReliabilityScore().intValue())
                        .build())
                .nextLevel(worker.getLevelNumber() < 4 ? worker.getLevelNumber() + 1 : 4)
                .salaryRange(getSalaryRange(worker.getLevelNumber()))
                .build()));
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<ApiResponse<LevelProgressResponse>> getLevelProgress(@PathVariable String userId) {
        WorkerProfile worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        return ResponseEntity.ok(ApiResponse.ok(LevelProgressResponse.builder()
                .currentLevel(worker.getLevelNumber())
                .levelScore(worker.getLevelScore().intValue())
                .nextLevel(worker.getLevelNumber() < 4 ? worker.getLevelNumber() + 1 : 4)
                .progress(calculateProgress(worker))
                .build()));
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
}
