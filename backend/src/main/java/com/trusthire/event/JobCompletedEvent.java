package com.trusthire.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

@Getter
public class JobCompletedEvent extends ApplicationEvent {
    private final UUID jobId;
    private final String workerId;

    public JobCompletedEvent(Object source, UUID jobId, String workerId) {
        super(source);
        this.jobId = jobId;
        this.workerId = workerId;
    }
}
