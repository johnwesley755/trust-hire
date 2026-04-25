package com.trusthire.service.impl;

import com.trusthire.entity.UserMetadata;
import com.trusthire.entity.UserSettings;
import com.trusthire.repository.UserMetadataRepository;
import com.trusthire.repository.UserSettingsRepository;
import com.trusthire.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private final UserSettingsRepository settingsRepository;
    private final UserMetadataRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserSettings getSettings(String userId) {
        return settingsRepository.findById(userId)
                .orElseGet(() -> {
                    UserSettings defaultSettings = UserSettings.builder()
                            .userId(userId)
                            .build();
                    return settingsRepository.save(defaultSettings);
                });
    }

    @Override
    @Transactional
    public UserSettings updateSettings(String userId, UserSettings updates) {
        UserSettings existing = getSettings(userId);
        
        existing.setEmailNotifications(updates.isEmailNotifications());
        existing.setPushNotifications(updates.isPushNotifications());
        existing.setMarketingEmails(updates.isMarketingEmails());
        existing.setTheme(updates.getTheme());
        existing.setLanguage(updates.getLanguage());
        
        return settingsRepository.save(existing);
    }

    @Override
    @Transactional
    public void changePassword(String userId, String oldPassword, String newPassword) {
        UserMetadata user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Incorrect old password");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
