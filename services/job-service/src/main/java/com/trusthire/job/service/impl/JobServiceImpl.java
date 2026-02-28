package com.trusthire.job.service.impl;

import com.trusthire.job.entity.Job;
import com.trusthire.job.repository.JobRepository;
import com.trusthire.job.service.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobServiceImpl implements JobService {

    private final JobRepository repository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${ai.scoring-engine.url:http://localhost:5000/score/match}")
    private String scoringEngineUrl;

    @Override
    @Transactional
    public Job createJob(Job job) {
        log.info("Creating job: {}", job.getTitle());
        if (job.getStatus() == null) {
            job.setStatus(Job.JobStatus.OPEN);
        }
        return repository.save(job);
    }

    @Override
    public List<Job> getAllJobs() {
        return repository.findAll();
    }

    @Override
    public Optional<Job> getJobById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public List<Job> getJobsByEmployer(String employerClerkId) {
        return repository.findByEmployerClerkId(employerClerkId);
    }

    @Override
    @Transactional
    public Job updateJob(Job job) {
        log.info("Updating job: {}", job.getId());
        return repository.save(job);
    }

    @Override
    @Transactional
    public void deleteJob(UUID id) {
        log.info("Deleting job: {}", id);
        repository.deleteById(id);
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
            java.util.Map<String, Object> request = new java.util.HashMap<>();
            request.put("job_description", job.getDescription() + " " + job.getTitle());
            request.put("worker_profile", workerProfile);
            request.put("worker_skills", workerSkills);

            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> response = restTemplate.postForObject(scoringEngineUrl, request, java.util.Map.class);

            if (response != null && response.containsKey("score")) {
                return ((Number) response.get("score")).doubleValue();
            }
        } catch (Exception e) {
            log.error("Error calling scoring engine: {}", e.getMessage());
        }
        return 0.0;
    }
}
