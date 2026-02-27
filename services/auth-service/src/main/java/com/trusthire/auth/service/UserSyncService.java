package com.trusthire.auth.service;

import java.util.Map;

public interface UserSyncService {
    void syncUser(Map<String, Object> clerkData);
}
