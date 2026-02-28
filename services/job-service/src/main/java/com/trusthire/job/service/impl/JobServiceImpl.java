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
}
