package com.trusthire.service.impl;

import com.trusthire.entity.UserActivity;
import com.trusthire.repository.UserActivityRepository;
import com.trusthire.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final UserActivityRepository activityRepository;

    @Override
    public List<UserActivity> getRecentActivities(String userId, int limit) {
        return activityRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, limit));
    }

    @Override
    @Transactional
    public void logActivity(String userId, String type, String description, String targetId) {
        UserActivity activity = UserActivity.builder()
                .userId(userId)
                .type(type)
                .description(description)
                .targetId(targetId)
                .build();
        activityRepository.save(activity);
    }
}
