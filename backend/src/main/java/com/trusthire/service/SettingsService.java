package com.trusthire.service;

import com.trusthire.entity.UserSettings;

public interface SettingsService {
    UserSettings getSettings(String userId);
    UserSettings updateSettings(String userId, UserSettings settings);
    void changePassword(String userId, String oldPassword, String newPassword);
}
