package com.trusthire.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class TestResultResponse {
    private UUID testId;
    private int score;
    private boolean passed;
    private int correctAnswers;
    private int totalQuestions;
    private String feedback;
}
