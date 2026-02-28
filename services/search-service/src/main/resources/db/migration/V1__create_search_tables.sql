CREATE TABLE job_search_index (
    job_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    location VARCHAR(255),
    budget DOUBLE PRECISION,
    budget_type VARCHAR(50),
    employer_clerk_id VARCHAR(255),
    status VARCHAR(50),
    indexed_at TIMESTAMP WITHOUT TIME ZONE,
    last_updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX idx_job_search_category ON job_search_index(category);
CREATE INDEX idx_job_search_status ON job_search_index(status);
