package com.trusthire.rating.service.impl;

import com.trusthire.rating.entity.Rating;
import com.trusthire.rating.repository.RatingRepository;
import com.trusthire.rating.service.RatingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingServiceImpl implements RatingService {

    private final RatingRepository repository;

    @Override
    @Transactional
    public Rating submitRating(Rating rating) {
        log.info("Submitting rating for ratee: {} by reviewer: {}", rating.getRateeId(), rating.getReviewerId());
        return repository.save(rating);
    }

    @Override
    public List<Rating> getRatingsForUser(String rateeId) {
        return repository.findByRateeId(rateeId);
    }

    @Override
    public List<Rating> getRatingsByUser(String reviewerId) {
        return repository.findByReviewerId(reviewerId);
    }

    @Override
    public Double getAverageRatingForUser(String rateeId) {
        List<Rating> ratings = repository.findByRateeId(rateeId);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        return ratings.stream()
                .mapToInt(Rating::getScore)
                .average()
                .orElse(0.0);
    }

    @Override
    public Optional<Rating> getRatingById(UUID id) {
        return repository.findById(id);
    }
}
