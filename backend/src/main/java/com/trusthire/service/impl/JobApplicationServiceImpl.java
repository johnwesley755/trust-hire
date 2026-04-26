package com.trusthire.service.impl;

import com.trusthire.entity.Job;
import com.trusthire.entity.JobApplication;
import com.trusthire.exception.BadRequestException;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.exception.UnauthorizedException;
import com.trusthire.repository.JobApplicationRepository;
import com.trusthire.repository.JobRepository;
import com.trusthire.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final com.trusthire.service.ActivityService activityService;

    @Override
    @Transactional
    public JobApplication applyForJob(String workerId, UUID jobId, String coverLetter) {
        if (applicationRepository.findByJobIdAndWorkerId(jobId, workerId).isPresent()) {
            throw new BadRequestException("You have already applied for this job");
        }
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new BadRequestException("This job is no longer open for applications");
        }

        JobApplication application = JobApplication.builder()
                .jobId(jobId)
                .workerId(workerId)
                .coverLetter(coverLetter)
                .status(JobApplication.ApplicationStatus.PENDING)
                .build();
        
        JobApplication saved = applicationRepository.save(application);

        // Log Activity for Employer
        activityService.logActivity(
            job.getEmployerId(),
            "APPLICATION_RECEIVED",
            "New application received for: " + job.getTitle(),
            saved.getId().toString()
        );

        return saved;
    }

    @Override
    public List<JobApplication> getMyApplications(String workerId) {
        return applicationRepository.findByWorkerId(workerId);
    }

    @Override
    public List<JobApplication> getApplicationsForJob(UUID jobId, String employerId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        if (!job.getEmployerId().equals(employerId)) {
            throw new UnauthorizedException("You are not the owner of this job");
        }
        
        return applicationRepository.findByJobId(jobId);
    }

    @Override
    public List<JobApplication> getApplicationsByJobIds(List<UUID> jobIds) {
        return applicationRepository.findByJobIdIn(jobIds);
    }

    @Override
    public Map<UUID, Long> getApplicationCountsByJobIds(List<UUID> jobIds) {
        List<JobApplication> apps = applicationRepository.findByJobIdIn(jobIds);
        return apps.stream()
                .collect(Collectors.groupingBy(JobApplication::getJobId, Collectors.counting()));
    }

    @Override
    @Transactional
    public JobApplication updateApplicationStatus(UUID id, JobApplication.ApplicationStatus status, String userId) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // Only employer of the job or the worker (if cancelling) can update status?
        // Usually employer updates status to ACCEPTED/REJECTED.
        if (!job.getEmployerId().equals(userId)) {
            throw new UnauthorizedException("Only the employer can update application status");
        }

        application.setStatus(status);
        JobApplication saved = applicationRepository.save(application);

        // Log Activity for Employer
        String activityType = status == JobApplication.ApplicationStatus.ACCEPTED ? "HIRED" : "APPLICATION_UPDATED";
        String activityDesc = status == JobApplication.ApplicationStatus.ACCEPTED ? 
            "Approved application for: " + job.getTitle() : 
            "Rejected application for: " + job.getTitle();

        activityService.logActivity(
            userId,
            activityType,
            activityDesc,
            saved.getId().toString()
        );

        return saved;
    }
}
