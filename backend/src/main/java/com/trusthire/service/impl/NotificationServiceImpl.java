package com.trusthire.service.impl;

import com.trusthire.entity.Notification;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.exception.UnauthorizedException;
import com.trusthire.repository.NotificationRepository;
import com.trusthire.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void sendNotification(String userId, String title, String message, String type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        Notification saved = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, saved);
    }

    @Override
    public List<Notification> getMyNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID id, String userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not own this notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
