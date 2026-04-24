package com.trusthire.service;

import com.trusthire.dto.response.TestResultResponse;
import com.trusthire.entity.SkillTest;

import java.util.List;
import java.util.UUID;

public interface SkillTestService {
    List<SkillTest> getAllAvailableTests();
    SkillTest getTestById(UUID id);
    TestResultResponse submitTest(String userId, UUID testId, List<Integer> answers);
}
