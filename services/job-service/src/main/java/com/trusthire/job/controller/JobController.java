package com.trusthire.job.controller;

import com.trusthire.job.entity.Job;
import com.trusthire.job.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<Job> createJob(@AuthenticationPrincipal Jwt jwt, @RequestBody Job job) {
        job.setEmployerId(jwt.getSubject());
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @PostMapping("/by-ids")
    public ResponseEntity<List<Job>> getJobsByIds(@RequestBody List<UUID> ids) {
        return ResponseEntity.ok(jobService.getJobsByIds(ids));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable UUID id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/employer")
    public ResponseEntity<List<Job>> getEmployerJobs(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(jobService.getJobsByEmployer(jwt.getSubject()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id, @RequestBody Job jobRequest) {
        return jobService.getJobById(id)
                .map(job -> {
                    if (!job.getEmployerId().equals(jwt.getSubject())) {
                        return ResponseEntity.status(403).<Job>build();
                    }
                    job.setTitle(jobRequest.getTitle());
                    job.setDescription(jobRequest.getDescription());
                    job.setIndustry(jobRequest.getIndustry());
                    job.setRequiredSkills(jobRequest.getRequiredSkills());
                    job.setExperienceYearsRequired(jobRequest.getExperienceYearsRequired());
                    job.setBudget(jobRequest.getBudget());
                    job.setLocation(jobRequest.getLocation());
                    job.setLatitude(jobRequest.getLatitude());
                    job.setLongitude(jobRequest.getLongitude());
                    job.setStatus(jobRequest.getStatus());
                    return ResponseEntity.ok(jobService.updateJob(job));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        return jobService.getJobById(id)
                .map(job -> {
                    if (!job.getEmployerId().equals(jwt.getSubject())) {
                        return ResponseEntity.status(403).<Void>build();
                    }
                    jobService.deleteJob(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<com.trusthire.job.dto.StatsDTO> getGlobalStats() {
        return ResponseEntity.ok(jobService.getGlobalStats());
    }
}
