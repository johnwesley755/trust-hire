package com.trusthire.service;

import com.trusthire.entity.VerificationRecord;

public interface VerificationService {
    VerificationRecord uploadDoc(String userId, String url);
    VerificationRecord captureLive(String userId, String url);
    VerificationRecord getStatus(String userId);
}
