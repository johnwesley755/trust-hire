package com.trusthire.job.client;

import lombok.Builder;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "search-service", url = "${SEARCH_SERVICE_URL:http://localhost:8082}")
public interface SearchClient {

    @PostMapping("/api/search/index/job")
    void indexJob(@RequestBody JobSearchRequest request);

    @Data
    @Builder
    class JobSearchRequest {
        private UUID jobId;
        private String title;
        private String description;
        private String industry;
        private String location;
        private String city;
        private Double latitude;
        private Double longitude;
        private Double budget;
        private String requiredSkills;
        private Integer experienceYearsRequired;
        private String address;
        private String employerId;
        private String status;
    }
}
