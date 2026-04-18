package com.trusthire.worker.controller;

import com.trusthire.worker.entity.SkillTest;
import com.trusthire.worker.service.CertificationService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skill-tests")
@RequiredArgsConstructor
public class SkillTestController {

    private final CertificationService certificationService;

    @GetMapping("/available")
    public ResponseEntity<List<SkillTest>> getAvailableTests(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(certificationService.getAllAvailableTests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillTest> getTestById(@PathVariable UUID id) {
        return ResponseEntity.ok(certificationService.getTestById(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<CertificationService.TestResultDto> submitResult(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody TestSubmission submission) {
        return ResponseEntity.ok(certificationService.submitTest(
                jwt.getSubject(),
                submission.getTestId(),
                submission.getAnswers()));
    }

    @Data
    public static class TestSubmission {
        private UUID testId;
        private String workerId;
        private List<Integer> answers;
        private int maxPoints;
    }
}
