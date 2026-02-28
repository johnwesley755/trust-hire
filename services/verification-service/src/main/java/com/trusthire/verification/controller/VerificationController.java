package com.trusthire.verification.controller;

import com.trusthire.verification.entity.VerificationRecord;
import com.trusthire.verification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/upload-doc")
    public ResponseEntity<VerificationRecord> uploadDoc(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(verificationService.uploadDocImage(jwt.getSubject(), file));
    }

    @PostMapping("/capture-live")
    public ResponseEntity<VerificationRecord> uploadLive(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(verificationService.uploadLiveCapture(jwt.getSubject(), file));
    }

    @GetMapping("/status")
    public ResponseEntity<VerificationRecord> getStatus(@AuthenticationPrincipal Jwt jwt) {
        return verificationService.getStatus(jwt.getSubject())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
