package com.trusthire.controller;

import com.trusthire.dto.request.VerificationRequest;
import com.trusthire.entity.VerificationRecord;
import com.trusthire.service.VerificationService;
import com.trusthire.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.trusthire.service.MediaService;
import java.io.IOException;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;
    private final MediaService mediaService;

    @PostMapping("/upload-doc")
    public ResponseEntity<ApiResponse<VerificationRecord>> uploadDoc(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {
        String userId = (String) authentication.getPrincipal();
        String url = mediaService.uploadMedia(file, userId).getUrl();
        return ResponseEntity.ok(ApiResponse.ok("Document uploaded", 
                verificationService.uploadDoc(userId, url)));
    }

    @PostMapping("/capture-live")
    public ResponseEntity<ApiResponse<VerificationRecord>> captureLive(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {
        String userId = (String) authentication.getPrincipal();
        String url = mediaService.uploadMedia(file, userId).getUrl();
        return ResponseEntity.ok(ApiResponse.ok("Live capture completed", 
                verificationService.captureLive(userId, url)));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<VerificationRecord>> getStatus(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(verificationService.getStatus(userId)));
    }
}
