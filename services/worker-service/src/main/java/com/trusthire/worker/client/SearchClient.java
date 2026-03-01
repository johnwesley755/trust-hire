package com.trusthire.worker.client;

import lombok.Builder;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "search-service", url = "${SEARCH_SERVICE_URL:http://localhost:8082}")
public interface SearchClient {

    @PostMapping("/api/search/index/worker")
    void indexWorker(@RequestBody WorkerSearchRequest request);

    @Data
    @Builder
    class WorkerSearchRequest {
        private String clerkId;
        private String name;
        private String bio;
        private String skills;
        private String location;
        private Double latitude;
        private Double longitude;
        private String level;
        private Boolean isVerified;
        private String profileImageUrl;
        private String status;
    }
}
