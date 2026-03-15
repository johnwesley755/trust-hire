package com.trusthire.notification.service;

import com.trusthire.notification.entity.Notification;
import java.util.List;
import java.util.UUID;

public interface NotificationService {
    Notification createNotification(Notification notification);
    List<Notification> getNotificationsForUser(String userId);
    void markAsRead(UUID id);
    void sendNotification(String userId, String title, String message, String email, boolean sendEmail);
}
