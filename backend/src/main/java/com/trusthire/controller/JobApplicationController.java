package com.trusthire.controller;

import com.trusthire.dto.request.JobApplicationRequest;
import com.trusthire.entity.JobApplication;
import com.trusthire.service.JobApplicationService;
import com.trusthire.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobApplication>> apply(
            Authentication authentication,
            @Valid @RequestBody JobApplicationRequest request) {
        String workerId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Application submitted", 
                applicationService.applyForJob(workerId, request.getJobId(), request.getCoverLetter())));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getMyApplications(Authentication authentication) {
        String workerId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getMyApplications(workerId)));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getJobApplications(
            Authentication authentication,
            @PathVariable UUID jobId) {
        String employerId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getApplicationsForJob(jobId, employerId)));
    }

    @PostMapping("/by-jobs")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getApplicationsByJobs(@RequestBody List<UUID> jobIds) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getApplicationsByJobIds(jobIds)));
    }

    @PostMapping("/counts/by-jobs")
    public ResponseEntity<ApiResponse<Map<UUID, Long>>> getApplicationCounts(@RequestBody List<UUID> jobIds) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getApplicationCountsByJobIds(jobIds)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<JobApplication>> updateStatus(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestParam String status) {
        String userId = (String) authentication.getPrincipal();
        JobApplication.ApplicationStatus appStatus = JobApplication.ApplicationStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(ApiResponse.ok("Status updated", 
                applicationService.updateApplicationStatus(id, appStatus, userId)));
    }
}
