package com.trusthire.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class WorkerRatedEvent extends ApplicationEvent {
    private final String workerId;

    public WorkerRatedEvent(Object source, String workerId) {
        super(source);
        this.workerId = workerId;
    }
}
