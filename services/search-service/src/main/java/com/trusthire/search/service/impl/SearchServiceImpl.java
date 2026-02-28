package com.trusthire.search.service.impl;

import com.trusthire.search.entity.JobSearch;
import com.trusthire.search.entity.WorkerSearch;
import com.trusthire.search.repository.JobSearchRepository;
import com.trusthire.search.repository.WorkerSearchRepository;
import com.trusthire.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final JobSearchRepository jobRepository;
    private final WorkerSearchRepository workerRepository;

    @Override
    public List<JobSearch> searchJobs(String query, String category, String location) {
        log.info("Searching jobs: query={}, category={}, location={}", query, category, location);
        return jobRepository.searchJobs(query, category, location);
    }

    @Override
    @Transactional
    public JobSearch indexJob(JobSearch jobSearch) {
        log.info("Indexing job: {}", jobSearch.getJobId());
        return jobRepository.save(jobSearch);
    }

    @Override
    @Transactional
    public void deleteJob(UUID jobId) {
        log.info("Deleting job: {}", jobId);
        jobRepository.deleteById(jobId);
    }

    @Override
    public List<WorkerSearch> searchWorkers(String query, String location, String level) {
        log.info("Searching workers: query={}, location={}, level={}", query, location, level);
        return workerRepository.searchWorkers(query, location, level);
    }

    @Override
    @Transactional
    public WorkerSearch indexWorker(WorkerSearch workerSearch) {
        log.info("Indexing worker: {}", workerSearch.getClerkId());
        return workerRepository.save(workerSearch);
    }

    @Override
    @Transactional
    public void deleteWorker(String clerkId) {
        log.info("Deleting worker: {}", clerkId);
        workerRepository.deleteById(clerkId);
    }
}
