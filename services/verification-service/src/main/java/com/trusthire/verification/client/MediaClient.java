package com.trusthire.verification.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@FeignClient(name = "media-service", url = "${MEDIA_SERVICE_URL:http://localhost:8089}")
public interface MediaClient {

    @PostMapping(value = "/api/media/internal/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MediaResponse uploadFileInternal(
            @RequestPart("file") MultipartFile file,
            @RequestParam("ownerId") String ownerId);

    class MediaResponse {
        private UUID id;
        private String url;
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }
}
