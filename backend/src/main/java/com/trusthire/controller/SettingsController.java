package com.trusthire.controller;

import com.trusthire.dto.request.PasswordChangeRequest;
import com.trusthire.entity.UserSettings;
import com.trusthire.service.SettingsService;
import com.trusthire.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserSettings>> getSettings(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(settingsService.getSettings(userId)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserSettings>> updateSettings(
            Authentication authentication,
            @RequestBody UserSettings settings) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Settings updated", settingsService.updateSettings(userId, settings)));
    }

    @PostMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody PasswordChangeRequest request) {
        String userId = (String) authentication.getPrincipal();
        settingsService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", "success"));
    }
}
