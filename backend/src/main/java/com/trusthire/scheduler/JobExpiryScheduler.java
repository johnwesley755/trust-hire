package com.trusthire.scheduler;

import com.trusthire.entity.Job;
import com.trusthire.repository.JobRepository;
import com.trusthire.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobExpiryScheduler {

    private final JobRepository jobRepository;
    private final SearchService searchService;

    @Value("${app.job.expiry-days:7}")
    private int expiryDays;

    // Run every minute to check for expired jobs
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireJobs() {
        log.info(">>> JobExpiryScheduler: Checking for expired jobs (Threshold: {} days)...", expiryDays);
        
        LocalDateTime expiryThreshold = LocalDateTime.now().minusDays(expiryDays);
        
        List<Job> expiredJobs = jobRepository.findByStatusAndCreatedAtBefore(
                Job.JobStatus.OPEN, 
                expiryThreshold
        );

        if (!expiredJobs.isEmpty()) {
            log.info(">>> JobExpiryScheduler: Found {} expired jobs. Expiring them...", expiredJobs.size());
            for (Job job : expiredJobs) {
                job.setStatus(Job.JobStatus.CLOSED);
                Job savedJob = jobRepository.save(job);
                
                // Update status in the search index
                searchService.indexJob(com.trusthire.entity.JobSearchIndex.builder()
                        .jobId(savedJob.getId())
                        .title(savedJob.getTitle())
                        .employerName(savedJob.getEmployerName())
                        .description(savedJob.getDescription())
                        .industry(savedJob.getIndustry())
                        .location(savedJob.getLocation())
                        .city(savedJob.getCity())
                        .address(savedJob.getAddress())
                        .latitude(savedJob.getLatitude())
                        .longitude(savedJob.getLongitude())
                        .budget(savedJob.getBudget() != null ? savedJob.getBudget().doubleValue() : null)
                        .status(savedJob.getStatus().name())
                        .requiredSkills(savedJob.getRequiredSkills() != null ? String.join(",", savedJob.getRequiredSkills()) : "")
                        .build());

                log.info(">>> JobExpiryScheduler: Job '{}' (ID: {}) status updated to CLOSED in DB and Search Index.", 
                        savedJob.getTitle(), savedJob.getId());
            }
        }
    }
}
