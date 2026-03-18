package com.trusthire.worker.dto;

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
    private String address;
    private String city;
    private String bio;
    private String skills;
    private Integer experienceYears;
    private String level;
}
