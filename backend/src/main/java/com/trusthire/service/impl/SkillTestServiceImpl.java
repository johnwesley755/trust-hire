package com.trusthire.service.impl;

import com.trusthire.dto.response.TestResultResponse;
import com.trusthire.entity.SkillTest;
import com.trusthire.entity.SkillTestQuestion;
import com.trusthire.entity.SkillTestResult;
import com.trusthire.repository.SkillTestRepository;
import com.trusthire.repository.SkillTestResultRepository;
import com.trusthire.service.LevelService;
import com.trusthire.service.SkillTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SkillTestServiceImpl implements SkillTestService {

    private final SkillTestRepository testRepository;
    private final SkillTestResultRepository resultRepository;
    private final LevelService levelService;

    @Override
    public List<SkillTest> getAllAvailableTests() {
        return testRepository.findAll();
    }

    @Override
    public SkillTest getTestById(UUID id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));
    }

    @Override
    @Transactional
    public TestResultResponse submitTest(String userId, UUID testId, List<Integer> answers) {
        SkillTest test = getTestById(testId);
        List<SkillTestQuestion> questions = test.getQuestions();

        int correctCount = 0;
        int totalQuestions = questions.size();

        for (int i = 0; i < totalQuestions; i++) {
            if (i < answers.size() && answers.get(i).equals(questions.get(i).getCorrectOption())) {
                correctCount++;
            }
        }

        int score = totalQuestions > 0 ? (int) ((double) correctCount / totalQuestions * 100) : 0;
        boolean passed = score >= 70; // 70% passing threshold

        SkillTestResult result = SkillTestResult.builder()
                .workerId(userId)
                .test(test)
                .score(score)
                .passed(passed)
                .build();

        resultRepository.save(result);

        if (passed) {
            levelService.calculateAndSaveLevel(userId);
        }

        return TestResultResponse.builder()
                .testId(testId)
                .score(score)
                .passed(passed)
                .correctAnswers(correctCount)
                .totalQuestions(totalQuestions)
                .feedback(passed ? "Congratulations! You have been certified." : "Focus on the safety guidelines and try again.")
                .build();
    }
}
