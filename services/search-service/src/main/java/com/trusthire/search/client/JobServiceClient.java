package com.trusthire.search.client;

import com.trusthire.search.dto.JobApplicationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "job-service", url = "${JOB_SERVICE_URL:http://localhost:8082}")
public interface JobServiceClient {

    @GetMapping("/api/jobs/applications/my")
    List<JobApplicationDTO> getMyApplications(@RequestHeader("Authorization") String token);
}
