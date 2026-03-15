package com.trusthire.media.controller;

import com.trusthire.media.entity.Media;
import com.trusthire.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
    public ResponseEntity<Media> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Jwt jwt) throws IOException {
        String ownerId = (jwt != null) ? jwt.getSubject() : "ANONYMOUS";
        return ResponseEntity.ok(mediaService.uploadFile(file, ownerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Media> getMedia(@PathVariable UUID id) {
        return ResponseEntity.ok(mediaService.getMediaInfo(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Media>> getMyMedia(@AuthenticationPrincipal Jwt jwt) {
        String ownerId = jwt.getSubject();
        return ResponseEntity.ok(mediaService.getMediaByOwner(ownerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable UUID id) throws IOException {
        mediaService.deleteMedia(id);
        return ResponseEntity.noContent().build();
    }

    // Industrial Standard: Internal endpoint for service-to-service communication
    @PostMapping("/internal/upload")
    public ResponseEntity<Media> uploadFileInternal(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerId") String ownerId) throws IOException {
        return ResponseEntity.ok(mediaService.uploadFile(file, ownerId));
    }
}
