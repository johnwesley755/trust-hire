package com.trusthire.service.impl;

import com.trusthire.entity.JobSearchIndex;
import com.trusthire.entity.WorkerSearchIndex;
import com.trusthire.repository.JobSearchIndexRepository;
import com.trusthire.repository.WorkerSearchIndexRepository;
import com.trusthire.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final JobSearchIndexRepository jobIndexRepository;
    private final WorkerSearchIndexRepository workerIndexRepository;

    @Override
    public List<JobSearchIndex> searchJobs(String query, String category, String location, String city, Double lat, Double lon, Double radius) {
        return jobIndexRepository.searchJobs(
                query, category, location, city, 
                lat == null ? -999.0 : lat, 
                lon == null ? -999.0 : lon, 
                radius == null ? -999.0 : radius);
    }

    @Override
    public List<WorkerSearchIndex> searchWorkers(String query, String level, String location, String city, Double lat, Double lon, Double radius) {
        return workerIndexRepository.searchWorkers(
                query, level, location, city, 
                lat == null ? -999.0 : lat, 
                lon == null ? -999.0 : lon, 
                radius == null ? -999.0 : radius);
    }

    @Override
    @Transactional
    public void indexJob(JobSearchIndex job) {
        jobIndexRepository.save(job);
    }

    @Override
    @Transactional
    public void removeJobFromIndex(UUID jobId) {
        jobIndexRepository.deleteById(jobId);
    }

    @Override
    @Transactional
    public void indexWorker(WorkerSearchIndex worker) {
        workerIndexRepository.save(worker);
    }

    @Override
    @Transactional
    public void removeWorkerFromIndex(String userId) {
        workerIndexRepository.deleteById(userId);
    }
}
