package com.trusthire.identity.service;

import com.trusthire.identity.entity.User;
import com.trusthire.identity.repository.UserRepository;
import com.trusthire.identity.repository.EmployerProfileRepository;
import com.trusthire.identity.repository.WorkerProfileRepository;
import com.trusthire.identity.entity.EmployerProfile;
import com.trusthire.identity.entity.WorkerProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSyncService {

    private final UserRepository userRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final WorkerProfileRepository workerProfileRepository;

    @Transactional
    public void syncUser(Map<String, Object> userData) {
        String clerkId = (String) userData.get("id");
        log.info("Syncing user from Clerk: {}", clerkId);

        List<Map<String, Object>> emailAddresses = (List<Map<String, Object>>) userData.get("email_addresses");
        String email = (String) emailAddresses.get(0).get("email_address");
        String firstName = (String) userData.get("first_name");
        String lastName = (String) userData.get("last_name");
        String imageUrl = (String) userData.get("image_url");

        // Extract role from public metadata if present, default to WORKER for safety or based on PWA source
        Map<String, Object> publicMetadata = (Map<String, Object>) userData.get("public_metadata");
        String roleStr = (String) publicMetadata.getOrDefault("role", "WORKER");
        User.UserRole role = User.UserRole.valueOf(roleStr.toUpperCase());

        User user = userRepository.findById(clerkId)
                .orElse(User.builder().clerkId(clerkId).build());

        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setProfileImageUrl(imageUrl);
        user.setRole(role);
        
        User savedUser = userRepository.save(user);

        // Initialize profile if not exists
        if (role == User.UserRole.EMPLOYER) {
            if (employerProfileRepository.findByUserClerkId(clerkId).isEmpty()) {
                log.info("Initializing Employer Profile for: {}", clerkId);
                employerProfileRepository.save(EmployerProfile.builder()
                        .user(savedUser)
                        .isVerified(false)
                        .businessTier("SILVER")
                        .build());
            }
        } else if (role == User.UserRole.WORKER) {
            if (workerProfileRepository.findByUserClerkId(clerkId).isEmpty()) {
                log.info("Initializing Worker Profile for: {}", clerkId);
                workerProfileRepository.save(WorkerProfile.builder()
                        .user(savedUser)
                        .fullName(firstName + " " + lastName)
                        .isAvailable(true)
                        .level("L1")
                        .build());
            }
        }
    }
}
