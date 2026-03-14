CREATE TABLE job_applications (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL,
    worker_clerk_id VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    applied_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cover_letter TEXT,
    CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
