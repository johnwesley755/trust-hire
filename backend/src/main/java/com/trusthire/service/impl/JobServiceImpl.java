package com.trusthire.service.impl;

import com.trusthire.dto.response.JobResponse;
import com.trusthire.entity.Job;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.exception.UnauthorizedException;
import com.trusthire.repository.JobApplicationRepository;
import com.trusthire.repository.JobRepository;
import com.trusthire.entity.JobSearchIndex;
import com.trusthire.service.JobService;
import com.trusthire.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final SearchService searchService;

    @Override
    @Transactional
    public Job createJob(String employerId, Job job) {
        job.setEmployerId(employerId);
        Job saved = jobRepository.save(job);
        indexJob(saved);
        return saved;
    }

    private void indexJob(Job job) {
        searchService.indexJob(JobSearchIndex.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .industry(job.getIndustry())
                .location(job.getLocation())
                .city(job.getCity())
                .address(job.getAddress())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .budget(job.getBudget() != null ? job.getBudget().doubleValue() : null)
                .status(job.getStatus().name())
                .requiredSkills(job.getRequiredSkills() != null ? String.join(",", job.getRequiredSkills()) : "")
                .build());
    }

    @Override
    public List<JobResponse> getAllJobs(String currentUserId) {
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream()
                .map(job -> {
                    boolean isApplied = currentUserId != null && 
                        applicationRepository.findByJobIdAndWorkerId(job.getId(), currentUserId).isPresent();
                    return JobResponse.fromEntity(job, isApplied);
                })
                .collect(Collectors.toList());
    }

    @Override
    public JobResponse getJobById(UUID id, String currentUserId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        boolean isApplied = currentUserId != null && 
                applicationRepository.findByJobIdAndWorkerId(job.getId(), currentUserId).isPresent();
        return JobResponse.fromEntity(job, isApplied);
    }

    @Override
    public List<Job> getJobsByEmployer(String employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    @Override
    @Transactional
    public Job updateJob(UUID id, String employerId, Job updates) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        if (!job.getEmployerId().equals(employerId)) {
            throw new UnauthorizedException("You are not the owner of this job");
        }

        if (updates.getTitle() != null) job.setTitle(updates.getTitle());
        if (updates.getDescription() != null) job.setDescription(updates.getDescription());
        if (updates.getIndustry() != null) job.setIndustry(updates.getIndustry());
        if (updates.getRequiredSkills() != null) job.setRequiredSkills(updates.getRequiredSkills());
        if (updates.getExperienceYearsRequired() != null) job.setExperienceYearsRequired(updates.getExperienceYearsRequired());
        if (updates.getBudget() != null) job.setBudget(updates.getBudget());
        if (updates.getLocation() != null) job.setLocation(updates.getLocation());
        if (updates.getLatitude() != null) job.setLatitude(updates.getLatitude());
        if (updates.getLongitude() != null) job.setLongitude(updates.getLongitude());
        if (updates.getCity() != null) job.setCity(updates.getCity());
        if (updates.getAddress() != null) job.setAddress(updates.getAddress());
        if (updates.getStatus() != null) job.setStatus(updates.getStatus());

        Job saved = jobRepository.save(job);
        indexJob(saved);
        return saved;
    }

    @Override
    @Transactional
    public void deleteJob(UUID id, String employerId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getEmployerId().equals(employerId)) {
            throw new UnauthorizedException("You are not the owner of this job");
        }
        jobRepository.delete(job);
        searchService.removeJobFromIndex(id);
    }

    @Override
    public List<Job> getJobsByIds(List<UUID> ids) {
        return jobRepository.findByIdIn(ids);
    }

    @Override
    public long getTotalJobsCount() {
        return jobRepository.count();
    }
}
