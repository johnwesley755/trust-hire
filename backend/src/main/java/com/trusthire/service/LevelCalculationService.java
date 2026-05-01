package com.trusthire.service;

import com.trusthire.entity.WorkerProfile;
import com.trusthire.repository.WorkerProfileRepository;
import com.trusthire.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LevelCalculationService {

    private final WorkerProfileRepository profileRepository;
    private final RatingRepository ratingRepository;

    public void calculateAndSaveLevel(String userId) {
        WorkerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        double skillScore = calculateSkillScore(profile);
        double experienceScore = calculateExperienceScore(profile);
        double performanceScore = calculatePerformanceScore(userId, profile);
        double reliabilityScore = calculateReliabilityScore(profile);

        double levelScore = (skillScore * 0.30)
                          + (experienceScore * 0.25)
                          + (performanceScore * 0.25)
                          + (reliabilityScore * 0.20);

        int newTrustScore = (int) Math.round(levelScore); // Scale 0-100
        profile.setTrustScore(newTrustScore);
        profile.setSkillScore(skillScore);
        profile.setExperienceScore(experienceScore);
        profile.setPerformanceScore(performanceScore);
        profile.setReliabilityScore(reliabilityScore);

        // Assign Level string based on score
        profile.setLevel(assignLevelName(newTrustScore));
        profile.setLevelNumber(assignLevelNumber(newTrustScore));

        profileRepository.save(profile);
    }

    private double calculateSkillScore(WorkerProfile profile) {
        double baseScore = 30.0;
        // variety bonus (up to 35)
        int skillCount = profile.getSkills() != null ? profile.getSkills().split(",").length : 0;
        double varietyBonus = Math.min(skillCount / 5.0, 1.0) * 35.0;
        
        // Placeholder for test bonus (up to 35)
        double testBonus = 0.0; 

        return Math.min(100, baseScore + varietyBonus + testBonus);
    }

    private double calculateExperienceScore(WorkerProfile profile) {
        // jobs completed (up to 50)
        double jobScore = Math.min(profile.getCompletedJobs() / 50.0, 1.0) * 50.0;
        
        // Months on platform (up to 50) - using createdAt if available, else experienceYears
        double monthsOnPlatform = profile.getExperienceYears() != null ? profile.getExperienceYears() * 12 : 0;
        double expScore = Math.min(monthsOnPlatform / 24.0, 1.0) * 50.0;

        return Math.min(100, jobScore + expScore);
    }

    private double calculatePerformanceScore(String userId, WorkerProfile profile) {
        Double avgRating = ratingRepository.getAverageRating(userId);
        if (avgRating == null) avgRating = 0.0;
        
        Integer ratingCount = ratingRepository.getRatingCount(userId);
        if (ratingCount == null) ratingCount = 0;

        // Avg rating (up to 70)
        double ratingScore = (avgRating / 5.0) * 70.0;
        // Rating count (up to 30)
        double countBonus = Math.min(ratingCount / 50.0, 1.0) * 30.0;

        return Math.min(100, ratingScore + countBonus);
    }

    private double calculateReliabilityScore(WorkerProfile profile) {
        // Completion rate (up to 60)
        int total = profile.getTotalJobs() > 0 ? profile.getTotalJobs() : 1;
        double completionRate = (double) profile.getCompletedJobs() / total * 100.0;
        double completionScore = completionRate / 100.0 * 60.0;

        // Stability bonus (up to 40)
        double stabilityScore = 20.0; // Default base stability

        // Abscond penalty
        double penalty = profile.getAbscondCount() * 20.0;

        return Math.max(0, Math.min(100, completionScore + stabilityScore - penalty));
    }

    private String assignLevelName(int score) {
        if (score >= 86) return "L4 Elite";
        if (score >= 66) return "L3 Pro Worker";
        if (score >= 41) return "L2 Skilled";
        return "L1 Beginner";
    }

    private int assignLevelNumber(int score) {
        if (score >= 86) return 4;
        if (score >= 66) return 3;
        if (score >= 41) return 2;
        return 1;
    }
}
