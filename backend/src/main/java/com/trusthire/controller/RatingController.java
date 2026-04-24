package com.trusthire.controller;

import com.trusthire.entity.Rating;
import com.trusthire.service.RatingService;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Rating>> submit(Authentication authentication, @RequestBody Rating rating) {
        String reviewerId = (String) authentication.getPrincipal();
        rating.setReviewerId(reviewerId);
        return ResponseEntity.ok(ApiResponse.ok("Rating submitted", ratingService.submitRating(rating)));
    }

    @GetMapping("/user/{rateeId}")
    public ResponseEntity<ApiResponse<List<Rating>>> getForUser(@PathVariable String rateeId) {
        return ResponseEntity.ok(ApiResponse.ok(ratingService.getRatingsForUser(rateeId)));
    }

    @GetMapping("/user/{rateeId}/average")
    public ResponseEntity<ApiResponse<Double>> getAverage(@PathVariable String rateeId) {
        return ResponseEntity.ok(ApiResponse.ok(ratingService.getAverageRatingForUser(rateeId)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Rating>>> getMyRatings(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(ratingService.getRatingsByUser(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rating>> getById(@PathVariable UUID id) {
        return ratingService.getRatingById(id)
                .map(rating -> ResponseEntity.ok(ApiResponse.ok(rating)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Rating not found")));
    }
}
