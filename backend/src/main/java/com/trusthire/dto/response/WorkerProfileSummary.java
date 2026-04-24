package com.trusthire.dto.response;

import com.trusthire.entity.WorkerProfile;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WorkerProfileSummary {
    private String userId;
    private String fullName;
    private String level;
    private String skills;
    private String city;
    private Integer trustScore;

    public static WorkerProfileSummary fromEntity(WorkerProfile profile) {
        return WorkerProfileSummary.builder()
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .level(profile.getLevel())
                .skills(profile.getSkills())
                .city(profile.getCity())
                .trustScore(profile.getTrustScore())
                .build();
    }
}
