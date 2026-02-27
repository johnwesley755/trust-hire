package com.trusthire.auth.controller;

import com.trusthire.auth.service.UserSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final UserSyncService syncService;

    @PostMapping("/clerk")
    public ResponseEntity<Void> handleClerkWebhook(
            @RequestHeader("svix-id") String svixId,
            @RequestHeader("svix-timestamp") String svixTimestamp,
            @RequestHeader("svix-signature") String svixSignature,
            @RequestBody Map<String, Object> payload) {
        
        log.info("Received Clerk webhook event: {}", payload.get("type"));
        
        // TODO: Implement Svix signature verification using the CLERK_WEBHOOK_SECRET
        
        String eventType = (String) payload.get("type");
        if ("user.created".equals(eventType) || "user.updated".equals(eventType)) {
            syncService.syncUser((Map<String, Object>) payload.get("data"));
        }

        return ResponseEntity.ok().build();
    }
}
