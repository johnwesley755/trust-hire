package com.trusthire.notification.service;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String body);
}
