package com.trusthire.service;

import com.trusthire.entity.Rating;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RatingService {
    Rating submitRating(Rating rating);
    List<Rating> getRatingsForUser(String rateeId);
    Double getAverageRatingForUser(String rateeId);
    Integer getRatingCountForUser(String rateeId);
    List<Rating> getRatingsByUser(String reviewerId);
    Optional<Rating> getRatingById(UUID id);
}
