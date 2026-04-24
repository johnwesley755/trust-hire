package com.trusthire.controller;

import com.trusthire.entity.Notification;
import com.trusthire.service.NotificationService;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getMyNotifications(userId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(Authentication authentication, @PathVariable UUID id) {
        String userId = (String) authentication.getPrincipal();
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", null));
    }
}
