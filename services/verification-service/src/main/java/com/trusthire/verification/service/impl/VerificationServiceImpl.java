package com.trusthire.verification.service.impl;

import com.trusthire.verification.client.MediaClient;
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
    private final MediaClient mediaClient;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${ai.face-match.url:http://localhost:5001/verify/face}")
    private String faceMatchUrl;

    @Override
    @Transactional
    public VerificationRecord uploadDocImage(String workerId, MultipartFile file) throws IOException {
        log.info("Uploading document image for worker: {} via Media Service", workerId);
        String url = uploadToMediaService(file, workerId);
        
        VerificationRecord record = repository.findByUserId(workerId)
                .orElse(VerificationRecord.builder().userId(workerId).build());
        
        record.setDocImageUrl(url);
        record.setStatus(VerificationRecord.VerificationStatus.PENDING);
        
        if (record.getLiveImageUrl() != null) {
            performFaceMatch(record);
        }
        
        return repository.save(record);
    }

    @Override
    @Transactional
    public VerificationRecord uploadLiveCapture(String workerId, MultipartFile file) throws IOException {
        log.info("Uploading live capture for worker: {} via Media Service", workerId);
        String url = uploadToMediaService(file, workerId);
        
        VerificationRecord record = repository.findByUserId(workerId)
                .orElse(VerificationRecord.builder().userId(workerId).build());
        
        record.setLiveImageUrl(url);
        
        if (record.getDocImageUrl() != null) {
            performFaceMatch(record);
        } else {
            record.setStatus(VerificationRecord.VerificationStatus.PENDING);
        }

        return repository.save(record);
    }

    private void performFaceMatch(VerificationRecord record) {
        log.info("Starting AI face match for worker: {}", record.getUserId());
        // For local testing: Simulate a successful AI face match
        // In production, this would call the Python AI microservice
        log.info("Face match simulated successful: {}", record.getUserId());
        record.setStatus(VerificationRecord.VerificationStatus.VERIFIED);
    }

    @Override
    public Optional<VerificationRecord> getStatus(String userId) {
        return repository.findByUserId(userId);
    }

    private String uploadToMediaService(MultipartFile file, String ownerId) {
        MediaClient.MediaResponse response = mediaClient.uploadFileInternal(file, ownerId);
        return response.getUrl();
    }
}
