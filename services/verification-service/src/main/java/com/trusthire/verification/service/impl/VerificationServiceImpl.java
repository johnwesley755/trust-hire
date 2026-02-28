package com.trusthire.verification.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.trusthire.verification.entity.VerificationRecord;
import com.trusthire.verification.repository.VerificationRepository;
import com.trusthire.verification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationServiceImpl implements VerificationService {

    private final VerificationRepository repository;
    private final Cloudinary cloudinary;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${ai.face-match.url:http://localhost:5001/verify/face}")
    private String faceMatchUrl;

    @Override
    @Transactional
    public VerificationRecord uploadDocImage(String workerClerkId, MultipartFile file) throws IOException {
        log.info("Uploading document image for worker: {}", workerClerkId);
        String url = uploadToCloudinary(file, "verification/docs/" + workerClerkId);
        
        VerificationRecord record = repository.findByWorkerClerkId(workerClerkId)
                .orElse(VerificationRecord.builder().workerClerkId(workerClerkId).build());
        
        record.setDocImageUrl(url);
        record.setStatus(VerificationRecord.VerificationStatus.PENDING);
        
        // Auto-trigger match if live capture exists
        if (record.getLiveImageUrl() != null) {
            performFaceMatch(record);
        }
        
        return repository.save(record);
    }

    @Override
    @Transactional
    public VerificationRecord uploadLiveCapture(String workerClerkId, MultipartFile file) throws IOException {
        log.info("Uploading live capture for worker: {}", workerClerkId);
        String url = uploadToCloudinary(file, "verification/live/" + workerClerkId);
        
        VerificationRecord record = repository.findByWorkerClerkId(workerClerkId)
                .orElse(VerificationRecord.builder().workerClerkId(workerClerkId).build());
        
        record.setLiveImageUrl(url);
        
        // If both images are present, initiate the AI face match
        if (record.getDocImageUrl() != null) {
            performFaceMatch(record);
        } else {
            record.setStatus(VerificationRecord.VerificationStatus.PENDING);
        }

        return repository.save(record);
    }

    private void performFaceMatch(VerificationRecord record) {
        log.info("Starting face match for worker: {}", record.getWorkerClerkId());
        try {
            java.util.Map<String, String> request = new java.util.HashMap<>();
            request.put("img1_path", record.getDocImageUrl());
            request.put("img2_path", record.getLiveImageUrl());

            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> response = restTemplate.postForObject(faceMatchUrl, request, java.util.Map.class);

            if (response != null && (Boolean) response.get("verified")) {
                log.info("Face match successful for worker: {}", record.getWorkerClerkId());
                record.setStatus(VerificationRecord.VerificationStatus.SUCCESS);
            } else {
                log.warn("Face match failed for worker: {}", record.getWorkerClerkId());
                record.setStatus(VerificationRecord.VerificationStatus.FAILED);
            }
        } catch (Exception e) {
            log.error("Error calling face match service: {}", e.getMessage());
            // Fallback: keep as PENDING for manual review if AI fails
            record.setStatus(VerificationRecord.VerificationStatus.PENDING);
        }
    }

    @Override
    public Optional<VerificationRecord> getStatus(String workerClerkId) {
        return repository.findByWorkerClerkId(workerClerkId);
    }

    private String uploadToCloudinary(MultipartFile file, String publicId) throws IOException {
        java.util.Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("public_id", publicId, "overwrite", true));
        return uploadResult.get("secure_url").toString();
    }
}
