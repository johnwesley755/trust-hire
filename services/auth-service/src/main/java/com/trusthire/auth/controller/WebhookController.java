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

    @PostMapping("/sync")
    public ResponseEntity<Void> handleLegacySync(
            @RequestBody Map<String, Object> payload) {
        
        log.info("Received legacy sync event: {}", payload.get("type"));
        
        // Legacy sync logic removed.
        return ResponseEntity.ok().build();
    }
}
