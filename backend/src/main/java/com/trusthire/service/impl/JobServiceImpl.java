package com.trusthire.service.impl;

import com.trusthire.dto.request.JobRequest;
import com.trusthire.dto.response.JobResponse;
import com.trusthire.entity.Job;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.exception.UnauthorizedException;
import com.trusthire.repository.JobApplicationRepository;
import com.trusthire.repository.JobRepository;
import com.trusthire.entity.JobSearchIndex;
import com.trusthire.service.ActivityService;
import com.trusthire.service.EmployerProfileService;
import com.trusthire.service.JobService;
import com.trusthire.service.NotificationSenderService;
import com.trusthire.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final SearchService searchService;
    private final NotificationSenderService notificationSenderService;
    private final ActivityService activityService;
    private final EmployerProfileService employerProfileService;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public Job createJob(String employerId, JobRequest request) {
        Job job = mapRequestToJob(request, new Job());
        job.setEmployerId(employerId);

        String companyName = employerProfileService.getProfileByUserId(employerId)
                .map(p -> p.getCompanyName())
                .orElse("Registered Partner");
        job.setEmployerName(companyName);

        // Set expiresAt to end-of-day of the supplied date
        if (request.getExpiresAt() != null) {
            job.setExpiresAt(request.getExpiresAt().atTime(LocalTime.MAX));
        }

        Job saved = jobRepository.save(job);
        indexJob(saved);

        // Notify Employer of success
        notificationSenderService.sendNotification(
            employerId,
            "Job Posted!",
            "Your job '" + saved.getTitle() + "' is now live and visible to workers.",
            "JOB_CREATED"
        );

        // Log Activity
        activityService.logActivity(
            employerId,
            "JOB_POSTED",
            "Posted a new job: " + saved.getTitle(),
            saved.getId().toString()
        );

        return saved;
    }

    /**
     * Maps all fields from a JobRequest onto a Job entity (create or update).
     */
    private Job mapRequestToJob(JobRequest request, Job job) {
        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getIndustry() != null) job.setIndustry(request.getIndustry());
        if (request.getRequiredSkills() != null) job.setRequiredSkills(request.getRequiredSkills());
        if (request.getExperienceYearsRequired() != null) job.setExperienceYearsRequired(request.getExperienceYearsRequired());
        if (request.getBudget() != null) job.setBudget(request.getBudget());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getLatitude() != null) job.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) job.setLongitude(request.getLongitude());
        if (request.getAddress() != null) job.setAddress(request.getAddress());
        if (request.getCity() != null) job.setCity(request.getCity());
        if (request.getStatus() != null) {
            try {
                job.setStatus(Job.JobStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException ignored) { /* keep existing status */ }
        }
        return job;
    }

    private void indexJob(Job job) {
        String companyName = job.getEmployerName() != null ? job.getEmployerName() : "Registered Partner";

        searchService.indexJob(JobSearchIndex.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .employerName(companyName)
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
    public Job updateJob(UUID id, String employerId, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        if (!job.getEmployerId().equals(employerId)) {
            throw new UnauthorizedException("You are not the owner of this job");
        }

        Job.JobStatus oldStatus = job.getStatus();
        mapRequestToJob(request, job);

        // Update expiresAt when provided
        if (request.getExpiresAt() != null) {
            job.setExpiresAt(request.getExpiresAt().atTime(LocalTime.MAX));
        }

        // Fire job-completed event if status changed to COMPLETED
        if (request.getStatus() != null
                && job.getStatus() == Job.JobStatus.COMPLETED
                && oldStatus != Job.JobStatus.COMPLETED) {
            applicationRepository.findByJobId(job.getId()).stream()
                .filter(app -> app.getStatus() == com.trusthire.entity.JobApplication.ApplicationStatus.ACCEPTED)
                .findFirst()
                .ifPresent(app -> {
                    eventPublisher.publishEvent(new com.trusthire.event.JobCompletedEvent(this, job.getId(), app.getWorkerId()));
                    
                    activityService.logActivity(
                        employerId,
                        "JOB_COMPLETED",
                        "Successfully completed job: " + job.getTitle(),
                        job.getId().toString()
                    );

                    activityService.logActivity(
                        app.getWorkerId(),
                        "JOB_COMPLETED",
                        "Completed job: " + job.getTitle() + ". Trust score updated!",
                        job.getId().toString()
                    );
                });
        }

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

    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    @Transactional
    public void reindexAllJobsOnStartup() {
        try {
            List<Job> allJobs = jobRepository.findAll();
            for (Job job : allJobs) {
                String companyName = employerProfileService.getProfileByUserId(job.getEmployerId())
                        .map(p -> p.getCompanyName())
                        .orElse("Registered Partner");
                job.setEmployerName(companyName);
                jobRepository.save(job);
                indexJob(job);
            }
            System.out.println(">>> SUCCESSFULLY RE-INDEXED ALL " + allJobs.size() + " JOBS IN SEARCH INDEX AND DATABASE ON APPLICATION READY!");
        } catch (Exception e) {
            System.err.println(">>> FAILED TO RE-INDEX JOBS: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
