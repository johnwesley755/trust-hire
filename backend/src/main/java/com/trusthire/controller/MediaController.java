package com.trusthire.controller;

import com.trusthire.entity.MediaAsset;
import com.trusthire.service.MediaService;
import com.trusthire.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MediaAsset>> upload(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {
        String ownerId = (authentication != null) ? (String) authentication.getPrincipal() : "anonymous";
        return ResponseEntity.ok(ApiResponse.ok("File uploaded", mediaService.uploadMedia(file, ownerId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MediaAsset>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(mediaService.getMediaById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<MediaAsset>>> getMyMedia(Authentication authentication) {
        String ownerId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(mediaService.getMyMedia(ownerId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(Authentication authentication, @PathVariable UUID id) throws IOException {
        String ownerId = (String) authentication.getPrincipal();
        mediaService.deleteMedia(id, ownerId);
        return ResponseEntity.ok(ApiResponse.ok("File deleted", null));
    }

    // Internal service-to-service upload (bypass auth if needed, but here we can just use regular upload)
    @PostMapping("/internal/upload")
    public ResponseEntity<ApiResponse<MediaAsset>> internalUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerId") String ownerId) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("File uploaded", mediaService.uploadMedia(file, ownerId)));
    }
}
