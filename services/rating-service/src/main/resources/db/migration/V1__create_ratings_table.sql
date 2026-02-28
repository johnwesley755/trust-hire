CREATE TABLE ratings (
    id UUID PRIMARY KEY,
    reviewer_clerk_id VARCHAR(255) NOT NULL,
    ratee_clerk_id VARCHAR(255) NOT NULL,
    job_id UUID NOT NULL,
    score INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX idx_ratings_ratee ON ratings(ratee_clerk_id);
CREATE INDEX idx_ratings_reviewer ON ratings(reviewer_clerk_id);
CREATE INDEX idx_ratings_job ON ratings(job_id);
