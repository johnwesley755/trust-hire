package com.trusthire.search.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class JobApplicationDTO {
    private UUID id;
    private UUID jobId;
    private String workerId;
    private String status;
}
