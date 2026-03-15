package com.trusthire.rating.service;

import com.trusthire.rating.entity.Rating;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RatingService {
    Rating submitRating(Rating rating);
    List<Rating> getRatingsForUser(String rateeId);
    List<Rating> getRatingsByUser(String reviewerId);
    Double getAverageRatingForUser(String rateeId);
    Optional<Rating> getRatingById(UUID id);
}
