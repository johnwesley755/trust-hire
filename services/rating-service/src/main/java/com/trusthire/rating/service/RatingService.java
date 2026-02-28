package com.trusthire.rating.service;

import com.trusthire.rating.entity.Rating;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RatingService {
    Rating submitRating(Rating rating);
    List<Rating> getRatingsForUser(String rateeClerkId);
    List<Rating> getRatingsByUser(String reviewerClerkId);
    Double getAverageRatingForUser(String rateeClerkId);
    Optional<Rating> getRatingById(UUID id);
}
