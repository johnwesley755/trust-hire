package com.trusthire.worker.service;

import com.trusthire.worker.entity.SkillTest;
import com.trusthire.worker.entity.SkillTestQuestion;
import com.trusthire.worker.entity.SkillTestResult;
import com.trusthire.worker.repository.SkillTestRepository;
import com.trusthire.worker.repository.SkillTestResultRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final SkillTestRepository testRepository;
    private final SkillTestResultRepository resultRepository;
    private final LevelCalculationService levelCalculationService;

    public List<SkillTest> getAllAvailableTests() {
        return testRepository.findAll();
    }

    public SkillTest getTestById(UUID id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));
    }

    @Transactional
    public TestResultDto submitTest(String userId, UUID testId, List<Integer> answers) {
        SkillTest test = getTestById(testId);
        List<SkillTestQuestion> questions = test.getQuestions();

        int correctCount = 0;
        int totalQuestions = questions.size();

        for (int i = 0; i < totalQuestions; i++) {
            if (i < answers.size() && answers.get(i).equals(questions.get(i).getCorrectOption())) {
                correctCount++;
            }
        }

        int score = (int) ((double) correctCount / totalQuestions * 100);
        boolean passed = score >= 70; // 70% passing threshold

        SkillTestResult result = SkillTestResult.builder()
                .workerId(userId)
                .test(test)
                .score(score)
                .passed(passed)
                .build();

        resultRepository.save(result);

        // Recalculate level if test was passed
        if (passed) {
            levelCalculationService.calculateAndSaveLevel(userId);
        }

        return TestResultDto.builder()
                .testId(testId)
                .score(score)
                .passed(passed)
                .correctAnswers(correctCount)
                .totalQuestions(totalQuestions)
                .feedback(passed ? "Congratulations! You have been certified." : "Focus on the safety guidelines and try again.")
                .build();
    }

    @Data
    @Builder
    public static class TestResultDto {
        private UUID testId;
        private int score;
        private boolean passed;
        private int correctAnswers;
        private int totalQuestions;
        private String feedback;
    }
}
