package com.trusthire.rating.controller;

import com.trusthire.rating.entity.Rating;
import com.trusthire.rating.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> submitRating(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Rating rating) {
        // Set the reviewer ID from the authenticated user
        rating.setReviewerClerkId(jwt.getSubject());
        return ResponseEntity.ok(ratingService.submitRating(rating));
    }

    @GetMapping("/user/{rateeClerkId}")
    public ResponseEntity<List<Rating>> getRatingsForUser(@PathVariable String rateeClerkId) {
        return ResponseEntity.ok(ratingService.getRatingsForUser(rateeClerkId));
    }

    @GetMapping("/user/{rateeClerkId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable String rateeClerkId) {
        return ResponseEntity.ok(ratingService.getAverageRatingForUser(rateeClerkId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Rating>> getMyRatings(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ratingService.getRatingsByUser(jwt.getSubject()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rating> getRatingById(@PathVariable UUID id) {
        return ratingService.getRatingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
