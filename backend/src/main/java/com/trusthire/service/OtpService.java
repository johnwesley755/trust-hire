package com.trusthire.service;

public interface OtpService {

    void generateAndSendOtp(String email);

    boolean validateOtp(String email, String otp);
}
