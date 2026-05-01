package com.trusthire.service.impl;

import com.trusthire.entity.VerificationRecord;
import com.trusthire.repository.VerificationRecordRepository;
import com.trusthire.service.VerificationService;
import com.trusthire.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

    private final VerificationRecordRepository verificationRepository;
    private final AuthService authService;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public VerificationRecord uploadDoc(String userId, String url) {
        VerificationRecord record = verificationRepository.findByUserId(userId)
                .orElse(VerificationRecord.builder().userId(userId).status("PENDING").build());
        record.setDocImageUrl(url);
        record.setStatus("PENDING");
        return verificationRepository.save(record);
    }

    @Override
    @Transactional
    public VerificationRecord captureLive(String userId, String url) {
        VerificationRecord record = verificationRepository.findByUserId(userId)
                .orElse(VerificationRecord.builder().userId(userId).status("PENDING").build());
        record.setLiveImageUrl(url);
        record.setStatus("VERIFIED"); // Mocking immediate verification for now
        
        authService.setIdentityVerified(userId, true);
        
        eventPublisher.publishEvent(new com.trusthire.event.WorkerVerifiedEvent(this, userId));
        
        return verificationRepository.save(record);
    }

    @Override
    public VerificationRecord getStatus(String userId) {
        return verificationRepository.findByUserId(userId)
                .orElse(VerificationRecord.builder().userId(userId).status("NONE").build());
    }
}
