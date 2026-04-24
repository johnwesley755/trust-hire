package com.trusthire.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class JobApplicationRequest {
    @NotNull(message = "Job ID is required")
    private UUID jobId;

    @NotBlank(message = "Cover letter is required")
    private String coverLetter;
}
