package com.trusthire.identity.controller;

import com.trusthire.identity.service.UserSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/identity/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final UserSyncService syncService;

    @PostMapping("/clerk")
    public ResponseEntity<Void> handleClerkWebhook(
            @RequestHeader(value = "svix-id", required = false) String svixId,
            @RequestHeader(value = "svix-timestamp", required = false) String svixTimestamp,
            @RequestHeader(value = "svix-signature", required = false) String svixSignature,
            @RequestBody Map<String, Object> payload) {
        
        String eventType = (String) payload.get("type");
        log.info("Received Clerk webhook: {}", eventType);
        
        // In a real industrial app, we would verify the svix signature here
        
        if ("user.created".equals(eventType) || "user.updated".equals(eventType)) {
            syncService.syncUser((Map<String, Object>) payload.get("data"));
        }

        return ResponseEntity.ok().build();
    }
}
