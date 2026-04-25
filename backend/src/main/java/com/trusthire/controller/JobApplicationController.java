package com.trusthire.controller;

import com.trusthire.entity.Job;
import com.trusthire.entity.JobApplication;
import com.trusthire.repository.JobApplicationRepository;
import com.trusthire.repository.JobRepository;
import com.trusthire.service.NotificationSenderService;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationRepository repository;
    private final JobRepository jobRepository;
    private final NotificationSenderService notificationSenderService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobApplication>> applyForJob(Authentication auth, @RequestBody JobApplication request) {
        String workerId = (String) auth.getPrincipal();
        UUID jobId = request.getJobId();
        
        if (jobId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Job ID is required"));
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if already applied
        if (repository.findByJobIdAndWorkerId(jobId, workerId).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You have already applied for this job"));
        }

        JobApplication application = JobApplication.builder()
                .jobId(jobId)
                .workerId(workerId)
                .status(JobApplication.ApplicationStatus.PENDING)
                .coverLetter(request.getCoverLetter())
                .job(job)
                .build();
        
        JobApplication saved = repository.save(application);

        // Notify Employer
        notificationSenderService.sendNotification(
            job.getEmployerId(),
            "New Application!",
            "A worker has applied for your job: " + job.getTitle(),
            "NEW_APPLICATION"
        );

        // Notify Worker
        notificationSenderService.sendNotification(
            workerId,
            "Application Submitted",
            "You have successfully applied for: " + job.getTitle(),
            "APPLICATION_SUBMITTED"
        );
        
        return ResponseEntity.ok(ApiResponse.ok("Application submitted successfully", saved));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<JobApplication>> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @RequestParam JobApplication.ApplicationStatus status) {
        
        JobApplication application = repository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        JobApplication saved = repository.save(application);

        // Notify Worker
        notificationSenderService.sendNotification(
            application.getWorkerId(),
            "Application Update",
            "Your application for '" + application.getJob().getTitle() + "' is now " + status,
            "APPLICATION_UPDATE"
        );

        return ResponseEntity.ok(ApiResponse.ok("Status updated", saved));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getMyApplications(Authentication auth) {
        String workerId = (String) auth.getPrincipal();
        List<JobApplication> applications = repository.findByWorkerId(workerId);
        return ResponseEntity.ok(ApiResponse.ok("My applications fetched", applications));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getJobApplications(@PathVariable UUID jobId) {
        List<JobApplication> applications = repository.findByJobId(jobId);
        return ResponseEntity.ok(ApiResponse.ok("Job applications fetched", applications));
    }

    @PostMapping("/by-jobs")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getApplicationsByJobs(@RequestBody List<UUID> jobIds) {
        List<JobApplication> applications = repository.findByJobIdIn(jobIds);
        return ResponseEntity.ok(ApiResponse.ok("Applications for jobs fetched", applications));
    }

    @PatchMapping("/{id}/status-old")
    public ResponseEntity<ApiResponse<JobApplication>> updateStatusOld(@PathVariable UUID id, @RequestParam JobApplication.ApplicationStatus status) {
        return repository.findById(id)
                .map(app -> {
                    app.setStatus(status);
                    repository.save(app);
                    return ResponseEntity.ok(ApiResponse.ok("Status updated", app));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
