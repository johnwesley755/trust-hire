package com.trusthire.notification.service.impl;

import com.trusthire.notification.entity.Notification;
import com.trusthire.notification.repository.NotificationRepository;
import com.trusthire.notification.service.EmailService;
import com.trusthire.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final EmailService emailService;

    @Override
    @Transactional
    public Notification createNotification(Notification notification) {
        log.info("Creating notification for recipient: {}", notification.getRecipientClerkId());
        return repository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsForUser(String recipientClerkId) {
        return repository.findByRecipientClerkIdOrderByCreatedAtDesc(recipientClerkId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID id) {
        repository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            repository.save(n);
        });
    }

    @Override
    @Transactional
    public void sendNotification(String recipientClerkId, String title, String message, String email, boolean sendEmail) {
        log.info("Sending notification to user: {}", recipientClerkId);
        
        // Save in-app notification
        Notification notification = Notification.builder()
                .recipientClerkId(recipientClerkId)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        repository.save(notification);

        // Send email if required
        if (sendEmail && email != null) {
            emailService.sendSimpleEmail(email, title, message);
        }
    }
}
