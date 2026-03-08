package com.trusthire.auth.controller;

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

    @PostMapping("/clerk")
    public ResponseEntity<Void> handleClerkWebhook(
            @RequestHeader("svix-id") String svixId,
            @RequestHeader("svix-timestamp") String svixTimestamp,
            @RequestHeader("svix-signature") String svixSignature,
            @RequestBody Map<String, Object> payload) {
        
        log.info("Received legacy Clerk webhook event: {}", payload.get("type"));
        
        // Clerk is removed. We acknowledge receipt but do not sync.

        return ResponseEntity.ok().build();
    }
}
