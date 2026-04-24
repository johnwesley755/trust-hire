package com.trusthire.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.trusthire.entity.MediaAsset;
import com.trusthire.exception.ResourceNotFoundException;
import com.trusthire.exception.UnauthorizedException;
import com.trusthire.repository.MediaRepository;
import com.trusthire.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final Cloudinary cloudinary;

    @Override
    @Transactional
    public MediaAsset uploadMedia(MultipartFile file, String ownerId) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("folder", "trusthire/assets"));

        MediaAsset asset = MediaAsset.builder()
                .url((String) uploadResult.get("secure_url"))
                .publicId((String) uploadResult.get("public_id"))
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .ownerId(ownerId)
                .build();

        return mediaRepository.save(asset);
    }

    @Override
    public MediaAsset getMediaById(UUID id) {
        return mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
    }

    @Override
    public List<MediaAsset> getMyMedia(String ownerId) {
        return mediaRepository.findByOwnerId(ownerId);
    }

    @Override
    @Transactional
    public void deleteMedia(UUID id, String ownerId) throws IOException {
        MediaAsset asset = getMediaById(id);
        if (!asset.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not own this media");
        }

        cloudinary.uploader().destroy(asset.getPublicId(), ObjectUtils.emptyMap());
        mediaRepository.delete(asset);
    }
}
