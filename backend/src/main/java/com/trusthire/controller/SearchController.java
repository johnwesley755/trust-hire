package com.trusthire.controller;

import com.trusthire.entity.JobSearchIndex;
import com.trusthire.entity.WorkerSearchIndex;
import com.trusthire.service.SearchService;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobSearchIndex>>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radius) {
        return ResponseEntity.ok(ApiResponse.ok(searchService.searchJobs(query, category, location, city, lat, lon, radius)));
    }

    @GetMapping("/workers")
    public ResponseEntity<ApiResponse<List<WorkerSearchIndex>>> searchWorkers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radius) {
        return ResponseEntity.ok(ApiResponse.ok(searchService.searchWorkers(query, level, location, city, lat, lon, radius)));
    }

    @PostMapping("/index/job")
    public ResponseEntity<ApiResponse<Void>> indexJob(@RequestBody JobSearchIndex job) {
        searchService.indexJob(job);
        return ResponseEntity.ok(ApiResponse.ok("Job indexed", null));
    }

    @DeleteMapping("/index/job/{jobId}")
    public ResponseEntity<ApiResponse<Void>> removeJob(@PathVariable UUID jobId) {
        searchService.removeJobFromIndex(jobId);
        return ResponseEntity.ok(ApiResponse.ok("Job removed from index", null));
    }

    @PostMapping("/index/worker")
    public ResponseEntity<ApiResponse<Void>> indexWorker(@RequestBody WorkerSearchIndex worker) {
        searchService.indexWorker(worker);
        return ResponseEntity.ok(ApiResponse.ok("Worker indexed", null));
    }

    @DeleteMapping("/index/worker/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeWorker(@PathVariable String userId) {
        searchService.removeWorkerFromIndex(userId);
        return ResponseEntity.ok(ApiResponse.ok("Worker removed from index", null));
    }
}
