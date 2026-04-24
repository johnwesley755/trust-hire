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

        // Weighted Formula from Docs
        double levelScore = (skillScore * 0.30)
                          + (experienceScore * 0.25)
                          + (performanceScore * 0.25)
                          + (reliabilityScore * 0.20);

        int levelNumber = assignLevel(levelScore);

        worker.setSkillScore(skillScore);
        worker.setExperienceScore(experienceScore);
        worker.setPerformanceScore(performanceScore);
        worker.setReliabilityScore(reliabilityScore);
        worker.setLevelScore(levelScore);
        worker.setLevelNumber(levelNumber);
        
        // Calculate Trust Score based on Level and performance
        int trustScore = (int) (levelScore * 0.8 + (performanceScore > 80 ? 20 : 0));
        worker.setTrustScore(Math.min(100, trustScore));

        workerRepository.save(worker);
        log.info("Recalculated level for worker {}: Score={}, Level={}", userId, levelScore, levelNumber);
    }

    private double calculateSkillScore(WorkerProfile worker) {
        double baseScore = 30.0;
        
        var passedTests = testResultRepository.findByWorkerIdAndPassedTrue(worker.getUserId());
        double testBonus = passedTests.stream()
                .mapToDouble(t -> t.getScore() / 100.0 * 35.0)
                .average().orElse(0.0);

        String skills = worker.getSkills();
        int skillCount = (skills != null && !skills.isEmpty()) ? skills.split(",").length : 0;
        double varietyBonus = Math.min(skillCount / 5.0, 1.0) * 35.0;

        return Math.min(100, baseScore + testBonus + varietyBonus);
    }

    private double calculateExperienceScore(WorkerProfile worker) {
        int years = worker.getExperienceYears() != null ? worker.getExperienceYears() : 0;
        return Math.min(years / 10.0, 1.0) * 100.0;
    }

    private double calculatePerformanceScore(WorkerProfile worker) {
        try {
            Double avgRating = ratingService.getAverageRatingForUser(worker.getUserId());
            Integer ratingCount = ratingService.getRatingCountForUser(worker.getUserId());
            
            if (avgRating == null || ratingCount == null || ratingCount == 0) return 0.0;

            double ratingScore = (avgRating / 5.0) * 70.0;
            double countBonus = Math.min(ratingCount / 20.0, 1.0) * 30.0;

            return Math.min(100, ratingScore + countBonus);
        } catch (Exception e) {
            log.warn("Rating service calculation error for worker {}: {}", worker.getUserId(), e.getMessage());
            return 0.0;
        }
    }

    private double calculateReliabilityScore(WorkerProfile worker) {
        return 80.0; // Placeholder baseline
    }

    private int assignLevel(double score) {
        if (score >= 86) return 4; // Elite
        if (score >= 66) return 3; // Pro Worker
        if (score >= 41) return 2; // Skilled
        return 1;                  // Beginner
    }
}
