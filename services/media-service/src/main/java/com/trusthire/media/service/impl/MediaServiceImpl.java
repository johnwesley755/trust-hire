package com.trusthire.media.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.trusthire.media.entity.Media;
import com.trusthire.media.repository.MediaRepository;
import com.trusthire.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaServiceImpl implements MediaService {

    private final Cloudinary cloudinary;
    private final MediaRepository repository;

    @Override
    @Transactional
    public Media uploadFile(MultipartFile file, String ownerId) throws IOException {
        log.info("Uploading file for owner: {}", ownerId);
        
        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        
        Media media = Media.builder()
                .url((String) uploadResult.get("secure_url"))
                .publicId((String) uploadResult.get("public_id"))
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .ownerId(ownerId)
                .build();
        
        return repository.save(media);
    }

    @Override
    public Media getMediaInfo(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found: " + id));
    }

    @Override
    public List<Media> getMediaByOwner(String ownerId) {
        return repository.findByOwnerId(ownerId);
    }

    @Override
    @Transactional
    public void deleteMedia(UUID id) throws IOException {
        Media media = getMediaInfo(id);
        log.info("Deleting media: {}", id);
        cloudinary.uploader().destroy(media.getPublicId(), ObjectUtils.emptyMap());
        repository.delete(media);
    }
}
