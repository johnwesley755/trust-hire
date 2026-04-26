package com.trusthire.service;

import com.trusthire.entity.UserActivity;
import java.util.List;

public interface ActivityService {
    List<UserActivity> getRecentActivities(String userId, int limit);
    void logActivity(String userId, String type, String description, String targetId);
}
