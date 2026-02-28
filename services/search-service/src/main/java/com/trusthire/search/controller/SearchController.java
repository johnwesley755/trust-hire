package com.trusthire.search.controller;

import com.trusthire.search.entity.JobSearch;
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
    public ResponseEntity<List<JobSearch>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(searchService.searchJobs(query, category, location));
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
}
