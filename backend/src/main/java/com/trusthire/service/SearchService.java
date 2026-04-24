package com.trusthire.service;

import com.trusthire.entity.JobSearchIndex;
import com.trusthire.entity.WorkerSearchIndex;
import java.util.List;
import java.util.UUID;

public interface SearchService {
    List<JobSearchIndex> searchJobs(String query, String category, String location, String city, Double lat, Double lon, Double radius);
    List<WorkerSearchIndex> searchWorkers(String query, String level, String location, String city, Double lat, Double lon, Double radius);
    
    void indexJob(JobSearchIndex job);
    void removeJobFromIndex(UUID jobId);
    
    void indexWorker(WorkerSearchIndex worker);
    void removeWorkerFromIndex(String userId);
}
