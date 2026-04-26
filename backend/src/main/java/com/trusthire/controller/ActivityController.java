package com.trusthire.controller;

import com.trusthire.entity.UserActivity;
import com.trusthire.service.ActivityService;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<UserActivity>>> getRecentActivities(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit) {
        String userId = (String) authentication.getPrincipal();
        List<UserActivity> activities = activityService.getRecentActivities(userId, limit);
        return ResponseEntity.ok(ApiResponse.ok(activities));
    }
}
