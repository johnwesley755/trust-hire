package com.trusthire.service;

import com.trusthire.entity.MediaAsset;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface MediaService {
    MediaAsset uploadMedia(MultipartFile file, String ownerId) throws IOException;
    MediaAsset getMediaById(UUID id);
    List<MediaAsset> getMyMedia(String ownerId);
    void deleteMedia(UUID id, String ownerId) throws IOException;
}
