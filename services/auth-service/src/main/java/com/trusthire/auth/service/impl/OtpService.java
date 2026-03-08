package com.trusthire.auth.service.impl;

import com.trusthire.auth.entity.UserMetadata;
import com.trusthire.auth.repository.UserMetadataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final UserMetadataRepository repository;
    
    // In memory store for OTPs (Ideally map to Redis, but HashMap works for prototyping)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    // Generates a random 6-digit OTP
    public String generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, otp);
        
        // Log it to console since we don't have a mail server yet
        log.info("====> OTP for {} is: {} <====", email, otp);
        return otp;
    }

    // Validates an OTP. If correct, verifies the email.
    public boolean validateOtp(String email, String otp) {
        String storedOtp = otpStore.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.remove(email); // Invalidate OTP after use
            
            // If the user exists in DB, mark them verified
            Optional<UserMetadata> userOpt = repository.findByEmail(email);
            if (userOpt.isPresent()) {
                UserMetadata user = userOpt.get();
                user.setEmailVerified(true);
                repository.save(user);
            }
            return true;
        }
        return false;
    }
}
