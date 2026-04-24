package com.trusthire.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LevelProgressResponse {
    private int currentLevel;
    private int levelScore;
    private int nextLevel;
    private double progress;
    private List<String> recommendations;
    private String estimatedTime;
}
