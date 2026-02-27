package com.trusthire.auth.service.impl;

import com.trusthire.auth.entity.UserMetadata;
import com.trusthire.auth.repository.UserMetadataRepository;
import com.trusthire.auth.service.UserSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSyncServiceImpl implements UserSyncService {

    private final UserMetadataRepository repository;

    @Override
    @Transactional
    public void syncUser(Map<String, Object> clerkData) {
        String clerkId = (String) clerkData.get("id");
        
        // Extract email and verification status
        List<Map<String, Object>> emailAddresses = (List<Map<String, Object>>) clerkData.get("email_addresses");
        boolean isEmailVerified = false;
        String email = "";

        if (emailAddresses != null && !emailAddresses.isEmpty()) {
            Map<String, Object> primaryEmail = emailAddresses.get(0); // Assuming first one is primary
            email = (String) primaryEmail.get("email_address");
            isEmailVerified = "verified".equals(primaryEmail.get("verification_status")) || (Boolean) primaryEmail.get("verified");
        }

        log.info("Processing sync for user: {} (Verified: {})", email, isEmailVerified);

        // Industrial Standard: Only fully enable accounts after email verification
        UserMetadata user = repository.findByClerkId(clerkId)
                .orElse(UserMetadata.builder().clerkId(clerkId).build());

        user.setEmail(email);
        user.setFirstName((String) clerkData.get("first_name"));
        user.setLastName((String) clerkData.get("last_name"));
        user.setProfileImageUrl((String) clerkData.get("profile_image_url"));
        user.setEmailVerified(isEmailVerified);
        
        // Handle Role from Public Metadata or Default to WORKER
        Map<String, Object> publicMetadata = (Map<String, Object>) clerkData.get("public_metadata");
        if (publicMetadata != null && publicMetadata.containsKey("role")) {
            user.setRole(UserMetadata.Role.valueOf((String) publicMetadata.get("role")));
        } else if (user.getRole() == null) {
            user.setRole(UserMetadata.Role.WORKER); 
        }

        repository.save(user);
    }
}
