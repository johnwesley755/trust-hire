-- 1. Create worker_search_index table
CREATE TABLE IF NOT EXISTS worker_search_index (
    clerk_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    skills TEXT,
    location VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    level VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    profile_image_url TEXT,
    status VARCHAR(50),
    indexed_at TIMESTAMP WITHOUT TIME ZONE,
    last_updated_at TIMESTAMP WITHOUT TIME ZONE
);

-- 2. Enhance job_search_index with missing geography and skills columns
ALTER TABLE job_search_index ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE job_search_index ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE job_search_index ADD COLUMN IF NOT EXISTS required_skills TEXT;

-- 3. Add optimized indices for search performance
CREATE INDEX IF NOT EXISTS idx_worker_search_skills ON worker_search_index(skills);
CREATE INDEX IF NOT EXISTS idx_worker_search_level ON worker_search_index(level);
CREATE INDEX IF NOT EXISTS idx_worker_search_status ON worker_search_index(status);
