package com.trusthire.identity.controller;

import com.trusthire.identity.entity.EmployerProfile;
import com.trusthire.identity.entity.WorkerProfile;
import com.trusthire.identity.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/identity/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/employer")
    public ResponseEntity<EmployerProfile> getEmployerProfile(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(profileService.getEmployerProfile(jwt.getSubject()));
    }

    @GetMapping("/worker")
    public ResponseEntity<WorkerProfile> getWorkerProfile(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(profileService.getWorkerProfile(jwt.getSubject()));
    }

    @PutMapping("/employer")
    public ResponseEntity<EmployerProfile> updateEmployerProfile(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody EmployerProfile updates) {
        return ResponseEntity.ok(profileService.updateEmployerProfile(jwt.getSubject(), updates));
    }

    @PutMapping("/worker")
    public ResponseEntity<WorkerProfile> updateWorkerProfile(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody WorkerProfile updates) {
        return ResponseEntity.ok(profileService.updateWorkerProfile(jwt.getSubject(), updates));
    }
}
