package com.trusthire.media.service;

import com.trusthire.media.entity.Media;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface MediaService {
    Media uploadFile(MultipartFile file, String ownerClerkId) throws IOException;
    Media getMediaInfo(UUID id);
    List<Media> getMediaByOwner(String ownerClerkId);
    void deleteMedia(UUID id) throws IOException;
}
