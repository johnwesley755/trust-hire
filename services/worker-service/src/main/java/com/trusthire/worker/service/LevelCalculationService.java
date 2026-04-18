package com.trusthire.worker.service;

import com.trusthire.worker.client.RatingClient;
import com.trusthire.worker.entity.WorkerProfile;
import com.trusthire.worker.repository.SkillTestResultRepository;
import com.trusthire.worker.repository.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LevelCalculationService {

    private final WorkerProfileRepository workerRepository;
    private final SkillTestResultRepository testResultRepository;
    private final RatingClient ratingClient;

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
        
        // Calculate Trust Score based on Level and performance (simplified for Phase 1)
        int trustScore = (int) (levelScore * 0.8 + (performanceScore > 80 ? 20 : 0));
        worker.setTrustScore(Math.min(100, trustScore));

        workerRepository.save(worker);
        log.info("Recalculated level for worker {}: Score={}, Level={}", userId, levelScore, levelNumber);
    }

    private double calculateSkillScore(WorkerProfile worker) {
        double baseScore = 30.0;
        
        // Skill test bonus (up to +35)
        var passedTests = testResultRepository.findByWorkerIdAndPassedTrue(worker.getUserId());
        double testBonus = passedTests.stream()
                .mapToDouble(t -> t.getScore() / 100.0 * 35.0)
                .average().orElse(0.0);

        // Skill variety bonus (up to +35) - based on comma-separated skills
        String skills = worker.getSkills();
        int skillCount = (skills != null && !skills.isEmpty()) ? skills.split(",").length : 0;
        double varietyBonus = Math.min(skillCount / 5.0, 1.0) * 35.0;

        return Math.min(100, baseScore + testBonus + varietyBonus);
    }

    private double calculateExperienceScore(WorkerProfile worker) {
        // Based on years of experience provided in profile
        int years = worker.getExperienceYears() != null ? worker.getExperienceYears() : 0;
        double expScore = Math.min(years / 10.0, 1.0) * 100.0;
        return expScore;
    }

    private double calculatePerformanceScore(WorkerProfile worker) {
        try {
            Double avgRating = ratingClient.getAverageRating(worker.getUserId());
            Integer ratingCount = ratingClient.getRatingCount(worker.getUserId());
            
            if (avgRating == null || ratingCount == null || ratingCount == 0) return 0.0;

            // Average rating (up to +70)
            double ratingScore = (avgRating / 5.0) * 70.0;

            // Rating count bonus (up to +30)
            double countBonus = Math.min(ratingCount / 20.0, 1.0) * 30.0;

            return Math.min(100, ratingScore + countBonus);
        } catch (Exception e) {
            log.warn("Rating service unavailable for worker {}: {}", worker.getUserId(), e.getMessage());
            return 0.0;
        }
    }

    private double calculateReliabilityScore(WorkerProfile worker) {
        // Placeholder for now, could be based on completion rate if we had job history
        return 80.0; // Assume baseline efficiency for new integrated system
    }

    private int assignLevel(double score) {
        if (score >= 86) return 4; // Elite
        if (score >= 66) return 3; // Pro Worker
        if (score >= 41) return 2; // Skilled
        return 1;                  // Beginner
    }
}
