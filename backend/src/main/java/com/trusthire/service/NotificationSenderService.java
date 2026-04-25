package com.trusthire.service;

import com.trusthire.entity.Notification;
import com.trusthire.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationSenderService {

    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, String title, String message, String type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        
        Notification saved = repository.save(notification);
        
        // Send via WebSocket
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", saved);
    }
}
