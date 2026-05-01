package com.trusthire.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class WorkerVerifiedEvent extends ApplicationEvent {
    private final String userId;

    public WorkerVerifiedEvent(Object source, String userId) {
        super(source);
        this.userId = userId;
    }
}
