package com.trusthire.service.impl;

import com.trusthire.entity.Rating;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.repository.RatingRepository;
import com.trusthire.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;
    private final com.trusthire.service.ActivityService activityService;

    @Override
    @Transactional
    public Rating submitRating(Rating rating) {
        Rating saved = ratingRepository.save(rating);
        eventPublisher.publishEvent(new com.trusthire.event.WorkerRatedEvent(this, saved.getRateeId()));

        activityService.logActivity(
            saved.getReviewerId(),
            "REVIEW_SUBMITTED",
            "Submitted a professional review",
            saved.getId().toString()
        );

        activityService.logActivity(
            saved.getRateeId(),
            "REVIEW_RECEIVED",
            "Received a new professional rating",
            saved.getId().toString()
        );

        return saved;
    }

    @Override
    public List<Rating> getRatingsForUser(String rateeId) {
        return ratingRepository.findByRateeId(rateeId);
    }

    @Override
    public Double getAverageRatingForUser(String rateeId) {
        Double avg = ratingRepository.getAverageRating(rateeId);
        return avg != null ? avg : 0.0;
    }

    @Override
    public Integer getRatingCountForUser(String rateeId) {
        return ratingRepository.getRatingCount(rateeId);
    }

    @Override
    public List<Rating> getRatingsByUser(String reviewerId) {
        return ratingRepository.findByReviewerId(reviewerId);
    }

    @Override
    public Optional<Rating> getRatingById(UUID id) {
        return ratingRepository.findById(id);
    }
}
