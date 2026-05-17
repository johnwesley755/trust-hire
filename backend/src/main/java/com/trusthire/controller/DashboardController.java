package com.trusthire.controller;

import com.trusthire.entity.Job;
import com.trusthire.repository.JobApplicationRepository;
import com.trusthire.repository.JobRepository;
import com.trusthire.repository.NotificationRepository;
import com.trusthire.repository.WorkerProfileRepository;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final WorkerProfileRepository workerProfileRepository;

    @GetMapping("/worker/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWorkerStats(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        String userId = (String) auth.getPrincipal();
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("appliedJobs", applicationRepository.countByWorkerId(userId));
        stats.put("unreadNotifications", notificationRepository.countByUserIdAndIsReadFalse(userId));
        
        workerProfileRepository.findByUserId(userId).ifPresent(profile -> {
            stats.put("level", profile.getLevel());
            stats.put("trustScore", profile.getTrustScore());
        });

        return ResponseEntity.ok(ApiResponse.ok("Worker stats fetched", stats));
    }

    @GetMapping("/employer/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEmployerStats(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        String userId = (String) auth.getPrincipal();
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("activeJobs", jobRepository.countByEmployerIdAndStatus(userId, Job.JobStatus.OPEN));
        stats.put("totalApplicants", applicationRepository.countByJobEmployerId(userId));
        stats.put("interviewingCount", applicationRepository.countByJobEmployerIdAndStatus(userId, com.trusthire.entity.JobApplication.ApplicationStatus.REVIEWING));
        stats.put("totalHired", applicationRepository.countByJobEmployerIdAndStatus(userId, com.trusthire.entity.JobApplication.ApplicationStatus.ACCEPTED));
        stats.put("unreadNotifications", notificationRepository.countByUserIdAndIsReadFalse(userId));

        return ResponseEntity.ok(ApiResponse.ok("Employer stats fetched", stats));
    }
}
