package com.trusthire.controller;

import com.trusthire.entity.Notification;
import com.trusthire.repository.NotificationRepository;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<Notification> notifications = repository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(ApiResponse.ok("Notifications fetched", notifications));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        long count = repository.countByUserIdAndIsReadFalse(userId);
        return ResponseEntity.ok(ApiResponse.ok("Unread count fetched", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable UUID id) {
        return repository.findById(id)
                .map(notif -> {
                    notif.setIsRead(true);
                    repository.save(notif);
                    return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", notif));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<Notification> notifications = repository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> {
            if (!n.getIsRead()) {
                n.setIsRead(true);
                repository.save(n);
            }
        });
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable UUID id) {
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Notification deleted", null));
    }

    @DeleteMapping("/all")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<Notification> notifications = repository.findByUserIdOrderByCreatedAtDesc(userId);
        repository.deleteAll(notifications);
        return ResponseEntity.ok(ApiResponse.ok("All notifications deleted", null));
    }
}
