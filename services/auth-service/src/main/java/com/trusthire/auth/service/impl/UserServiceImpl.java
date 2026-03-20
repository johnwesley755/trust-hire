package com.trusthire.auth.service.impl;

import com.trusthire.auth.entity.UserMetadata;
import com.trusthire.auth.repository.UserMetadataRepository;
import com.trusthire.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserMetadataRepository repository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${BREVO_SENDER_EMAIL}")
    private String fromEmail;

    @Value("${BREVO_SENDER_NAME:TrustHire}")
    private String fromName;

    @Value("${APP_URL:http://localhost:5173}")
    private String appUrl;

    @Override
    public Optional<UserMetadata> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public boolean isEmailVerified(String email) {
        return repository.findByEmail(email)
                .map(UserMetadata::getEmailVerified)
                .orElse(false);
    }

    @Override
    public void processForgotPassword(String email) {
        log.info("Processing forgot password for email: {}", email);
        UserMetadata user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        repository.save(user);

        sendResetEmail(user.getEmail(), token);
    }

    @Override
    public void updatePassword(String token, String newPassword) {
        log.info("Updating password for token: {}", token);
        UserMetadata user = repository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        repository.save(user);
    }

    private void sendResetEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String resetUrl = appUrl + "/reset-password?token=" + token;

            helper.setFrom(fromName + " <" + fromEmail + ">");
            helper.setTo(to);
            helper.setSubject("Reset Your TrustHire Password");

            String htmlContent = "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                    "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>" +
                    "<h2 style='color: #10b981;'>TrustHire</h2>" +
                    "<p>Hello,</p>" +
                    "<p>You requested to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>" +
                    "<div style='text-align: center; margin: 30px 0;'>" +
                    "<a href='" + resetUrl + "' style='background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; rounded-lg; display: inline-block;'>Reset Password</a>" +
                    "</div>" +
                    "<p>If you did not request this, please ignore this email.</p>" +
                    "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>" +
                    "<p style='font-size: 12px; color: #888;'>&copy; 2026 TrustHire Hub. All rights reserved.</p>" +
                    "</div></body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Reset email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send reset email to {}", to, e);
            throw new RuntimeException("Failed to send reset email", e);
        }
    }
}
