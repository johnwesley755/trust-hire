package com.trusthire.service.impl;

import com.trusthire.entity.WorkerProfile;
import com.trusthire.repository.SkillTestResultRepository;
import com.trusthire.repository.WorkerProfileRepository;
import com.trusthire.service.LevelService;
import com.trusthire.service.RatingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LevelServiceImpl implements LevelService {

    private final WorkerProfileRepository workerRepository;
    private final SkillTestResultRepository testResultRepository;
    private final com.trusthire.repository.UserMetadataRepository userMetadataRepository;
    private final com.trusthire.service.SearchService searchService;
    
    @Lazy
    private final RatingService ratingService;

    @Override
    @Transactional
    public void calculateAndSaveLevel(String userId) {
        WorkerProfile worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        double skillScore = calculateSkillScore(worker);
        double experienceScore = calculateExperienceScore(worker);
        double performanceScore = calculatePerformanceScore(worker);
        double reliabilityScore = calculateReliabilityScore(worker);

        // Weighted Formula: Skill 30%, Experience 25%, Performance 25%, Reliability 20%
        double levelScore = (skillScore * 0.30)
                          + (experienceScore * 0.25)
                          + (performanceScore * 0.25)
                          + (reliabilityScore * 0.20);

        int trustScore = (int) Math.round(levelScore); // Scale 0-100
        
        worker.setSkillScore(skillScore);
        worker.setExperienceScore(experienceScore);
        worker.setPerformanceScore(performanceScore);
        worker.setReliabilityScore(reliabilityScore);
        worker.setLevelScore(levelScore);
        worker.setTrustScore(trustScore);
        
        // Assign Level Name and Number
        worker.setLevel(assignLevelName(trustScore));
        worker.setLevelNumber(assignLevelNumber(trustScore));

        workerRepository.save(worker);
        
        // Update search index
        boolean isVerified = userMetadataRepository.findById(java.util.UUID.fromString(worker.getUserId()))
                .map(com.trusthire.entity.UserMetadata::getIdentityVerified)
                .orElse(false);

        searchService.indexWorker(com.trusthire.entity.WorkerSearchIndex.builder()
                .userId(worker.getUserId())
                .name(worker.getFullName() != null ? worker.getFullName() : "Anonymous")
                .bio(worker.getBio())
                .skills(worker.getSkills())
                .location(worker.getLocation())
                .city(worker.getCity())
                .latitude(worker.getLatitude())
                .longitude(worker.getLongitude())
                .level(worker.getLevel())
                .isVerified(isVerified)
                .status(worker.getIsAvailable() != null && worker.getIsAvailable() ? "AVAILABLE" : "BUSY")
                .trustScore(worker.getTrustScore())
                .build());


        log.info("Recalculated Trust Score for worker {}: Score={}, Level={}", userId, trustScore, worker.getLevel());
    }

    private double calculateSkillScore(WorkerProfile worker) {
        double baseScore = 30.0;
        
        // Test bonus (up to 35)
        var passedTests = testResultRepository.findByWorkerIdAndPassedTrue(worker.getUserId());
        double testBonus = passedTests.stream()
                .mapToDouble(t -> t.getScore() / 100.0 * 35.0)
                .average().orElse(0.0);

        // Variety bonus (up to 35)
        String skills = worker.getSkills();
        int skillCount = (skills != null && !skills.isEmpty()) ? skills.split(",").length : 0;
        double varietyBonus = Math.min(skillCount / 5.0, 1.0) * 35.0;

        return Math.min(100, baseScore + testBonus + varietyBonus);
    }

    private double calculateExperienceScore(WorkerProfile worker) {
        // Jobs completed (up to 50)
        int completedJobs = worker.getCompletedJobs() != null ? worker.getCompletedJobs() : 0;
        double jobScore = Math.min(completedJobs / 50.0, 1.0) * 50.0;
        
        // Months on platform (up to 50)
        double monthsOnPlatform = 0;
        if (worker.getCreatedAt() != null) {
            monthsOnPlatform = java.time.Duration.between(worker.getCreatedAt(), java.time.LocalDateTime.now()).toDays() / 30.0;
        } else if (worker.getExperienceYears() != null) {
            monthsOnPlatform = worker.getExperienceYears() * 12;
        }
        double longevityScore = Math.min(monthsOnPlatform / 24.0, 1.0) * 50.0;

        return Math.min(100, jobScore + longevityScore);
    }

    private double calculatePerformanceScore(WorkerProfile worker) {
        try {
            Double avgRating = ratingService.getAverageRatingForUser(worker.getUserId());
            Integer ratingCount = ratingService.getRatingCountForUser(worker.getUserId());
            
            if (avgRating == null || ratingCount == null || ratingCount == 0) return 0.0;

            // Avg rating (up to 70)
            double ratingScore = (avgRating / 5.0) * 70.0;
            // Rating count bonus (up to 30)
            double countBonus = Math.min(ratingCount / 50.0, 1.0) * 30.0;

            return Math.min(100, ratingScore + countBonus);
        } catch (Exception e) {
            log.warn("Rating calculation error for worker {}: {}", worker.getUserId(), e.getMessage());
            return 0.0;
        }
    }

    private double calculateReliabilityScore(WorkerProfile worker) {
        // Completion rate (up to 60)
        int totalJobs = worker.getTotalJobs() != null ? worker.getTotalJobs() : 0;
        int completedJobs = worker.getCompletedJobs() != null ? worker.getCompletedJobs() : 0;
        int total = totalJobs > 0 ? totalJobs : 1;
        double completionRate = (double) completedJobs / total * 100.0;
        double completionScore = (completionRate / 100.0) * 60.0;

        // Stability bonus (up to 40)
        double stabilityScore = 20.0; // Base

        // Penalties
        int abscondCount = worker.getAbscondCount() != null ? worker.getAbscondCount() : 0;
        double penalty = abscondCount * 20.0;

        return Math.max(0, Math.min(100, completionScore + stabilityScore - penalty));
    }

    private String assignLevelName(int score) {
        if (score >= 86) return "L4 Elite";
        if (score >= 66) return "L3 Pro";
        if (score >= 41) return "L2 Skilled";
        return "L1 Entry";
    }

    private int assignLevelNumber(int score) {
        if (score >= 86) return 4;
        if (score >= 66) return 3;
        if (score >= 41) return 2;
        return 1;
    }
}
