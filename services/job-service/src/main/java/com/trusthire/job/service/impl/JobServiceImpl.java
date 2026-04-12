package com.trusthire.job.service.impl;

import com.trusthire.job.entity.Job;
import com.trusthire.job.repository.JobRepository;
import com.trusthire.job.repository.JobApplicationRepository;
import com.trusthire.job.service.JobService;
import com.trusthire.job.dto.JobResponseDTO;
import com.trusthire.job.dto.StatsDTO;
import com.trusthire.job.client.SearchClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobServiceImpl implements JobService {

    private final JobRepository repository;
    private final JobApplicationRepository applicationRepository;
    private final SearchClient searchClient;
    private final RestTemplate restTemplate;

    @Value("${ai.scoring-engine.url:http://localhost:5000/score/match}")
    private String scoringEngineUrl;

    @Override
    @Transactional
    public Job createJob(Job job) {
        log.info("Creating job: {}", job.getTitle());
        if (job.getStatus() == null) {
            job.setStatus(Job.JobStatus.OPEN);
        }
        Job savedJob = repository.save(job);
        indexJobInSearch(savedJob);
        return savedJob;
    }

    @Override
    public List<Job> getAllJobs() {
        return repository.findAll();
    }

    @Override
    public List<JobResponseDTO> getAllJobsEnriched(String workerId) {
        log.info("Fetching enriched jobs for worker: {}", workerId);
        List<Job> jobs = repository.findAll();
        
        if (workerId == null || workerId.isBlank()) {
            return jobs.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
        }

        Set<UUID> appliedJobIds = applicationRepository.findByWorkerIdAndJobIdIn(
                workerId, jobs.stream().map(Job::getId).collect(Collectors.toList())
        ).stream().map(com.trusthire.job.entity.JobApplication::getJobId).collect(Collectors.toSet());

        return jobs.stream()
                .map(job -> {
                    JobResponseDTO dto = mapToResponseDTO(job);
                    dto.setApplied(appliedJobIds.contains(job.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Job> getJobsByIds(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        return repository.findByIdIn(ids);
    }

    @Override
    public Optional<Job> getJobById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Optional<JobResponseDTO> getJobByIdEnriched(UUID id, String workerId) {
        return repository.findById(id).map(job -> {
            JobResponseDTO dto = mapToResponseDTO(job);
            if (workerId != null && !workerId.isBlank()) {
                dto.setApplied(applicationRepository.existsByJobIdAndWorkerId(id, workerId));
            }
            return dto;
        });
    }

    @Override
    public List<Job> getJobsByEmployer(String employerId) {
        return repository.findByEmployerId(employerId);
    }

    private JobResponseDTO mapToResponseDTO(Job job) {
        return JobResponseDTO.builder()
                .id(job.getId())
                .employerId(job.getEmployerId())
                .title(job.getTitle())
                .description(job.getDescription())
                .industry(job.getIndustry())
                .requiredSkills(job.getRequiredSkills())
                .experienceYearsRequired(job.getExperienceYearsRequired())
                .budget(job.getBudget())
                .location(job.getLocation())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .address(job.getAddress())
                .city(job.getCity())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .isApplied(false)
                .build();
    }

    @Override
    @Transactional
    public Job updateJob(Job job) {
        log.info("Updating job: {}", job.getId());
        Job savedJob = repository.save(job);
        indexJobInSearch(savedJob);
        return savedJob;
    }

    @Override
    @Transactional
    public void deleteJob(UUID id) {
        log.info("Deleting job: {}", id);
        repository.deleteById(id);
    }

    private void indexJobInSearch(Job job) {
        try {
            SearchClient.JobSearchRequest request = SearchClient.JobSearchRequest.builder()
                    .jobId(job.getId())
                    .title(job.getTitle())
                    .description(job.getDescription())
                    .industry(job.getIndustry())
                    .location(job.getLocation())
                    .city(job.getCity())
                    .latitude(job.getLatitude())
                    .longitude(job.getLongitude())
                    .budget(job.getBudget() != null ? job.getBudget().doubleValue() : null)
                    .requiredSkills(job.getRequiredSkills() != null ? String.join(", ", job.getRequiredSkills()) : "")
                    .experienceYearsRequired(job.getExperienceYearsRequired())
                    .address(job.getAddress())
                    .employerId(job.getEmployerId())
                    .status(job.getStatus() != null ? job.getStatus().name() : "OPEN")
                    .build();
            searchClient.indexJob(request);
            log.info("Job {} indexed successfully", job.getId());
        } catch (Exception e) {
            log.error("Failed to index job {}: {}", job.getId(), e.getMessage());
        }
    }

    @Override
    public Double calculateMatchScore(UUID jobId, String workerProfile, List<String> workerSkills) {
        log.info("Calculating match score for job: {}", jobId);
        
        Optional<Job> jobOpt = repository.findById(jobId);
        if (jobOpt.isEmpty()) {
            log.error("Job not found: {}", jobId);
            return 0.0;
        }

        Job job = jobOpt.get();
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("job_description", job.getDescription() + " " + job.getTitle());
            request.put("worker_profile", workerProfile);
            request.put("worker_skills", workerSkills);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(scoringEngineUrl, request, Map.class);

            if (response != null && response.containsKey("score")) {
                return ((Number) response.get("score")).doubleValue();
            }
        } catch (Exception e) {
            log.error("Error calling scoring engine: {}", e.getMessage());
        }
        return 0.0;
    }

    @Override
    public StatsDTO getGlobalStats() {
        long totalJobs = repository.count();
        long jobsToday = repository.countByCreatedAtAfter(LocalDateTime.now().minusDays(1));
        return StatsDTO.builder()
                .totalJobs(totalJobs)
                .jobsToday(jobsToday)
                .build();
    }
}
