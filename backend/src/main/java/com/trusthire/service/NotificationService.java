package com.trusthire.service;

import com.trusthire.entity.Notification;
import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void sendNotification(String userId, String title, String message, String type);
    List<Notification> getMyNotifications(String userId);
    void markAsRead(UUID id, String userId);
}
