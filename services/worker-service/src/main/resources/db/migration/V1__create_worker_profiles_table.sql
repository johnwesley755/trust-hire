CREATE TABLE worker_profiles (
    id UUID PRIMARY KEY,
    clerk_id VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    skills TEXT[],
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_worker_clerk_id ON worker_profiles(clerk_id);
