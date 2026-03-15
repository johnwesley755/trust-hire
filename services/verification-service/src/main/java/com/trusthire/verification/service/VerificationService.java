package com.trusthire.verification.service;

import com.trusthire.verification.entity.VerificationRecord;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

public interface VerificationService {
    VerificationRecord uploadDocImage(String workerId, MultipartFile file) throws IOException;
    VerificationRecord uploadLiveCapture(String workerId, MultipartFile file) throws IOException;
    Optional<VerificationRecord> getStatus(String workerId);
}
