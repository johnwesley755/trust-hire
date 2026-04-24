package com.trusthire.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class TestSubmissionRequest {
    @NotNull(message = "Test ID is required")
    private UUID testId;

    @NotEmpty(message = "Answers cannot be empty")
    private List<Integer> answers;
}
