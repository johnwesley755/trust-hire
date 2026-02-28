CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    recipient_clerk_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_clerk_id);
