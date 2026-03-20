package com.trusthire.search.service;

import com.trusthire.search.entity.JobSearch;
import com.trusthire.search.entity.WorkerSearch;
import java.util.List;
import java.util.UUID;

public interface SearchService {
    // Jobs
    List<JobSearch> searchJobs(String query, String category, String location, String city, Double lat, Double lon, Double radius);
    JobSearch indexJob(JobSearch jobSearch);
    void deleteJob(UUID jobId);

    // Workers
    List<WorkerSearch> searchWorkers(String query, String location, String city, String level, Double lat, Double lon, Double radius);
    WorkerSearch indexWorker(WorkerSearch workerSearch);
    void deleteWorker(String userId);
}
