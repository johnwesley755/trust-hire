package com.trusthire.controller;

import com.trusthire.dto.response.JobResponse;
import com.trusthire.entity.Job;
import com.trusthire.service.JobService;
import com.trusthire.util.ApiResponse;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<ApiResponse<Job>> createJob(Authentication authentication, @RequestBody Job job) {
        String employerId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Job created", jobService.createJob(employerId, job)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs(Authentication authentication) {
        String currentUserId = authentication != null ? (String) authentication.getPrincipal() : null;
        return ResponseEntity.ok(ApiResponse.ok(jobService.getAllJobs(currentUserId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(Authentication authentication, @PathVariable UUID id) {
        String currentUserId = authentication != null ? (String) authentication.getPrincipal() : null;
        return ResponseEntity.ok(ApiResponse.ok(jobService.getJobById(id, currentUserId)));
    }

    @GetMapping("/employer")
    public ResponseEntity<ApiResponse<List<Job>>> getMyJobs(Authentication authentication) {
        String employerId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(jobService.getJobsByEmployer(employerId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> updateJob(Authentication authentication, @PathVariable UUID id, @RequestBody Job updates) {
        String employerId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Job updated", jobService.updateJob(id, employerId, updates)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(Authentication authentication, @PathVariable UUID id) {
        String employerId = (String) authentication.getPrincipal();
        jobService.deleteJob(id, employerId);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted", null));
    }

    @PostMapping("/by-ids")
    public ResponseEntity<ApiResponse<List<Job>>> getJobsByIds(@RequestBody List<UUID> ids) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getJobsByIds(ids)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<JobStats>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(JobStats.builder()
                .totalJobs(jobService.getTotalJobsCount())
                .build()));
    }

    @Data @Builder
    public static class JobStats {
        private long totalJobs;
    }
}
