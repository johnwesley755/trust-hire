package com.trusthire.job.controller;

import com.trusthire.job.entity.JobApplication;
import com.trusthire.job.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping
    public ResponseEntity<JobApplication> apply(@AuthenticationPrincipal Jwt jwt, @RequestBody JobApplication application) {
        application.setWorkerId(jwt.getSubject());
        return ResponseEntity.ok(applicationService.applyForJob(application));
    }

    @PostMapping("/by-jobs")
    public ResponseEntity<List<JobApplication>> getByJobs(@RequestBody List<UUID> jobIds) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobIds(jobIds));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getByJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobApplication>> getMyApplications(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(applicationService.getApplicationsByWorker(jwt.getSubject()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable UUID id,
            @RequestParam JobApplication.ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }
}
