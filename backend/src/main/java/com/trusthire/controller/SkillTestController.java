package com.trusthire.controller;

import com.trusthire.dto.request.TestSubmissionRequest;
import com.trusthire.dto.response.TestResultResponse;
import com.trusthire.entity.SkillTest;
import com.trusthire.service.SkillTestService;
import com.trusthire.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skill-tests")
@RequiredArgsConstructor
public class SkillTestController {

    private final SkillTestService certificationService;

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<SkillTest>>> getAvailableTests(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.getAllAvailableTests()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillTest>> getTestById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.getTestById(id)));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<TestResultResponse>> submitResult(
            Authentication authentication,
            @Valid @RequestBody TestSubmissionRequest submission) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Test submitted", 
                certificationService.submitTest(userId, submission.getTestId(), submission.getAnswers())));
    }
}
