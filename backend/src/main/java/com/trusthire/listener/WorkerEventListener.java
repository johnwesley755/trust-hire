package com.trusthire.listener;

import com.trusthire.event.WorkerRatedEvent;
import com.trusthire.service.LevelCalculationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkerEventListener {

    private final com.trusthire.service.LevelService levelService;

    @Async
    @EventListener
    public void handleWorkerRated(WorkerRatedEvent event) {
        log.info("Worker rated event received for worker: {}. Recalculating trust score.", event.getWorkerId());
        recalculate(event.getWorkerId());
    }

    @Async
    @EventListener
    public void handleWorkerVerified(com.trusthire.event.WorkerVerifiedEvent event) {
        log.info("Worker verified event received for worker: {}. Recalculating trust score.", event.getUserId());
        recalculate(event.getUserId());
    }

    @Async
    @EventListener
    public void handleJobCompleted(com.trusthire.event.JobCompletedEvent event) {
        log.info("Job completed event received for worker: {}. Recalculating trust score.", event.getWorkerId());
        recalculate(event.getWorkerId());
    }

    private void recalculate(String userId) {
        try {
            levelService.calculateAndSaveLevel(userId);
        } catch (Exception e) {
            log.error("Failed to recalculate trust score for worker: {}", userId, e);
        }
    }
}
