package com.trusthire.job.service.impl;

import com.trusthire.job.client.WorkerProfileClient;
import com.trusthire.job.entity.JobApplication;
import com.trusthire.job.repository.JobApplicationRepository;
import com.trusthire.job.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository repository;
    private final WorkerProfileClient workerProfileClient;

    @Override
    public JobApplication applyForJob(JobApplication application) {
        WorkerProfileClient.ProfileCompletionStatus completionStatus =
                workerProfileClient.getProfileCompletion(application.getWorkerId());

        if (completionStatus == null || !completionStatus.isComplete()) {
            List<String> missingFields = completionStatus != null && completionStatus.getMissingFields() != null
                    ? completionStatus.getMissingFields()
                    : List.of("profile");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Complete your profile before applying. Missing: " + String.join(", ", missingFields)
            );
        }

        return repository.findByJobIdAndWorkerId(application.getJobId(), application.getWorkerId())
                .orElseGet(() -> repository.save(application));
    }

    @Override
    public List<JobApplication> getApplicationsByJob(UUID jobId) {
        return repository.findByJobId(jobId);
    }

    @Override
    public List<JobApplication> getApplicationsByJobIds(List<UUID> jobIds) {
        return repository.findByJobIdIn(jobIds);
    }

    @Override
    public List<JobApplication> getApplicationsByWorker(String workerId) {
        return repository.findByWorkerId(workerId);
    }

    @Override
    public JobApplication updateApplicationStatus(UUID id, JobApplication.ApplicationStatus status) {
        return repository.findById(id).map(app -> {
            app.setStatus(status);
            return repository.save(app);
        }).orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Override
    public Optional<JobApplication> getApplicationById(UUID id) {
        return repository.findById(id);
    }
}
