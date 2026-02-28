package com.trusthire.search.service.impl;

import com.trusthire.search.entity.JobSearch;
import com.trusthire.search.repository.JobSearchRepository;
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

    private final JobSearchRepository repository;

    @Override
    public List<JobSearch> searchJobs(String query, String category, String location) {
        log.info("Searching jobs with query: {}, category: {}, location: {}", query, category, location);
        return repository.searchJobs(query, category, location);
    }

    @Override
    @Transactional
    public JobSearch indexJob(JobSearch jobSearch) {
        log.info("Indexing job: {}", jobSearch.getJobId());
        return repository.save(jobSearch);
    }

    @Override
    @Transactional
    public void deleteJob(UUID jobId) {
        log.info("Deleting job from search index: {}", jobId);
        repository.deleteById(jobId);
    }
}
