package com.trusthire.job.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "worker-service", url = "${WORKER_SERVICE_URL:http://localhost:8082}")
public interface WorkerProfileClient {

    @GetMapping("/api/worker/internal/profiles/{userId}/completion")
    ProfileCompletionStatus getProfileCompletion(@PathVariable("userId") String userId);

    @Data
    class ProfileCompletionStatus {
        private boolean complete;
        private List<String> missingFields;
    }
}
