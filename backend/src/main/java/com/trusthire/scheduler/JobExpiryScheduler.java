package com.trusthire.scheduler;

import com.trusthire.entity.Job;
import com.trusthire.repository.JobRepository;
import com.trusthire.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    /**
     * Runs every minute. Finds all OPEN jobs whose employer-specified expiresAt
     * timestamp is in the past and marks them CLOSED.
     *
     * Jobs with no expiresAt set are left untouched (legacy / no-expiry behaviour).
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireJobs() {
        LocalDateTime now = LocalDateTime.now();
        log.info(">>> JobExpiryScheduler: Checking for jobs past their expiry date at {}...", now);

        List<Job> expiredJobs = jobRepository.findByStatusAndExpiresAtBeforeAndExpiresAtIsNotNull(
                Job.JobStatus.OPEN,
                now
        );

        if (!expiredJobs.isEmpty()) {
            log.info(">>> JobExpiryScheduler: Found {} expired jobs. Closing them...", expiredJobs.size());
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

                log.info(">>> JobExpiryScheduler: Job '{}' (ID: {}) expired on {} — status set to CLOSED.",
                        savedJob.getTitle(), savedJob.getId(), savedJob.getExpiresAt());
            }
        } else {
            log.debug(">>> JobExpiryScheduler: No expired jobs found.");
        }
    }
}
