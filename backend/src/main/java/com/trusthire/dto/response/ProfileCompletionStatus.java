package com.trusthire.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileCompletionStatus {
    private int percentage;
    private boolean isBioComplete;
    private boolean isSkillsComplete;
    private boolean isLocationComplete;
    private boolean isContactComplete;
}
