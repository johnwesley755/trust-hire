package com.trusthire.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LevelDetailsResponse {
    private String workerId;
    private int currentLevel;
    private int levelScore;
    private LevelComponents components;
    private int nextLevel;
    private int pointsToNextLevel;
    private String salaryRange;
    private List<String> achievements;

    @Data
    @Builder
    public static class LevelComponents {
        private int skillScore;
        private int experienceScore;
        private int performanceScore;
        private int reliabilityScore;
    }
}
