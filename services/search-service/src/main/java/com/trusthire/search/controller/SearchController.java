package com.trusthire.search.controller;

import com.trusthire.search.entity.JobSearch;
import com.trusthire.search.entity.WorkerSearch;
import com.trusthire.search.service.SearchService;
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
    public ResponseEntity<List<com.trusthire.search.dto.JobSearchResponseDTO>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radius,
            @RequestHeader(name = "Authorization", required = false) String token) {
        return ResponseEntity.ok(searchService.searchJobs(query, category, location, city, lat, lon, radius, token));
    }

    @PostMapping("/index/job")
    public ResponseEntity<JobSearch> indexJob(@RequestBody JobSearch jobSearch) {
        return ResponseEntity.ok(searchService.indexJob(jobSearch));
    }

    @DeleteMapping("/index/job/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable UUID jobId) {
        searchService.deleteJob(jobId);
        return ResponseEntity.noContent().build();
    }

    // Workers
    @GetMapping("/workers")
    public ResponseEntity<List<WorkerSearch>> searchWorkers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radius) {
        return ResponseEntity.ok(searchService.searchWorkers(query, location, city, level, lat, lon, radius));
    }

    @PostMapping("/index/worker")
    public ResponseEntity<WorkerSearch> indexWorker(@RequestBody WorkerSearch workerSearch) {
        return ResponseEntity.ok(searchService.indexWorker(workerSearch));
    }

    @DeleteMapping("/index/worker/{userId}")
    public ResponseEntity<Void> deleteWorker(@PathVariable String userId) {
        searchService.deleteWorker(userId);
        return ResponseEntity.noContent().build();
    }
}
