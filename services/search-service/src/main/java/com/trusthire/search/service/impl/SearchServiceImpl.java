package com.trusthire.search.service.impl;

import com.trusthire.search.client.JobServiceClient;
import com.trusthire.search.dto.JobApplicationDTO;
import com.trusthire.search.dto.JobSearchResponseDTO;
import com.trusthire.search.entity.JobSearch;
import com.trusthire.search.entity.WorkerSearch;
import com.trusthire.search.repository.JobSearchRepository;
import com.trusthire.search.repository.WorkerSearchRepository;
import com.trusthire.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final JobSearchRepository jobRepository;
    private final WorkerSearchRepository workerRepository;
    private final JobServiceClient jobServiceClient;

    @Override
    public List<JobSearchResponseDTO> searchJobs(String query, String category, String location, String city, Double lat, Double lon, Double radius, String token) {
        log.info("Searching jobs: query={}, category={}, location={}, city={}, lat={}, lon={}, radius={}", query, category, location, city, lat, lon, radius);
        Double safeLat = lat != null ? lat : -999.0;
        Double safeLon = lon != null ? lon : -999.0;
        Double safeRadius = radius != null ? radius : -999.0;
        
        List<JobSearch> results = jobRepository.searchJobs(query, category, location, city, safeLat, safeLon, safeRadius);
        
        // Fetch user applications if token is provided
        Set<UUID> appliedJobIds = Collections.emptySet();
        if (token != null && !token.isBlank()) {
            try {
                List<JobApplicationDTO> myApps = jobServiceClient.getMyApplications(token);
                appliedJobIds = myApps.stream()
                        .map(JobApplicationDTO::getJobId)
                        .collect(Collectors.toSet());
            } catch (Exception e) {
                log.error("Failed to fetch applications for user: {}", e.getMessage());
            }
        }
        
        final Set<UUID> finalAppliedJobIds = appliedJobIds;
        return results.stream()
                .map(job -> mapToResponseDTO(job, finalAppliedJobIds.contains(job.getJobId())))
                .collect(Collectors.toList());
    }

    private JobSearchResponseDTO mapToResponseDTO(JobSearch job, boolean isApplied) {
        return JobSearchResponseDTO.builder()
                .jobId(job.getJobId())
                .title(job.getTitle())
                .description(job.getDescription())
                .industry(job.getIndustry())
                .requiredSkills(job.getRequiredSkills() != null 
                        ? java.util.Arrays.asList(job.getRequiredSkills().split(", ")) 
                        : java.util.Collections.emptyList())
                .budget(job.getBudget() != null 
                        ? java.math.BigDecimal.valueOf(job.getBudget()) 
                        : java.math.BigDecimal.ZERO)
                .location(job.getLocation())
                .city(job.getCity())
                .address(job.getAddress())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .level(job.getLevel())
                .status(job.getStatus())
                .indexedAt(job.getIndexedAt())
                .lastUpdatedAt(job.getLastUpdatedAt())
                .isApplied(isApplied)
                .build();
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
    public List<WorkerSearch> searchWorkers(String query, String location, String city, String level, Double lat, Double lon, Double radius) {
        log.info("Searching workers: query={}, location={}, city={}, level={}, lat={}, lon={}, radius={}", query, location, city, level, lat, lon, radius);
        Double safeLat = lat != null ? lat : -999.0;
        Double safeLon = lon != null ? lon : -999.0;
        Double safeRadius = radius != null ? radius : -999.0;
        return workerRepository.searchWorkers(query, location, city, level, safeLat, safeLon, safeRadius);
    }

    @Override
    @Transactional
    public WorkerSearch indexWorker(WorkerSearch workerSearch) {
        log.info("Indexing worker: {}", workerSearch.getUserId());
        return workerRepository.save(workerSearch);
    }

    @Override
    @Transactional
    public void deleteWorker(String userId) {
        log.info("Deleting worker: {}", userId);
        workerRepository.deleteById(userId);
    }
}
