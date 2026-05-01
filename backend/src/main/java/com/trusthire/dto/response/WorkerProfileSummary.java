package com.trusthire.dto.response;

import com.trusthire.entity.UserMetadata;
import com.trusthire.entity.WorkerProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileSummary {
    private String userId;
    private String fullName;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String profileImageUrl;
    private String level;
    private String skills;
    private String bio;
    private Integer experienceYears;
    private String city;
    private String address;
    private Integer trustScore;
    private Double latitude;
    private Double longitude;
    private Boolean identityVerified;
    private Double reliabilityScore;
    private Double performanceScore;
    private Double skillScore;
    private Boolean isAvailable;

    public static WorkerProfileSummary fromEntity(WorkerProfile profile, UserMetadata user) {
        WorkerProfileSummary.WorkerProfileSummaryBuilder builder = WorkerProfileSummary.builder()
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .level(profile.getLevel())
                .skills(profile.getSkills())
                .bio(profile.getBio())
                .experienceYears(profile.getExperienceYears())
                .city(profile.getCity())
                .address(profile.getAddress())
                .trustScore(profile.getTrustScore())
                .latitude(profile.getLatitude())
                .longitude(profile.getLongitude())
                .reliabilityScore(profile.getReliabilityScore())
                .performanceScore(profile.getPerformanceScore())
                .skillScore(profile.getSkillScore())
                .isAvailable(profile.getIsAvailable());

        if (user != null) {
            builder.firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .phoneNumber(user.getPhoneNumber())
                    .profileImageUrl(user.getProfileImageUrl())
                    .identityVerified(user.getIdentityVerified());
            
            if (profile.getFullName() == null || profile.getFullName().isBlank()) {
                String fullName = "";
                if (user.getFirstName() != null) fullName += user.getFirstName();
                if (user.getLastName() != null) fullName += (fullName.isEmpty() ? "" : " ") + user.getLastName();
                builder.fullName(fullName);
            }
        }

        return builder.build();
    }
}
