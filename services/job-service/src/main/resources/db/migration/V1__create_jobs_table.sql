CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    employer_clerk_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(255),
    experience_years_required INTEGER,
    budget DECIMAL(10, 2),
    location VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE job_required_skills (
    job_id UUID NOT NULL,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id, skill),
    CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
