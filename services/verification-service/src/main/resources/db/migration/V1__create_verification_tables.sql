CREATE TABLE verification_records (
    id UUID PRIMARY KEY,
    worker_clerk_id VARCHAR(255) NOT NULL UNIQUE,
    doc_image_url VARCHAR(500),
    live_image_url VARCHAR(500),
    status VARCHAR(50) NOT NULL,
    confidence_score VARCHAR(50),
    failure_reason TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
