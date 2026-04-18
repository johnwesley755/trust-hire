package com.trusthire.worker.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "rating-service", url = "${RATING_SERVICE_URL:http://localhost:8086}")
public interface RatingClient {

    @GetMapping("/api/ratings/user/{rateeId}/average")
    Double getAverageRating(@PathVariable("rateeId") String rateeId);

    @GetMapping("/api/ratings/user/{rateeId}/count")
    Integer getRatingCount(@PathVariable("rateeId") String rateeId);
}
