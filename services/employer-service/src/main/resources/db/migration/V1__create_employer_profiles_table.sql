CREATE TABLE employer_profiles (
    id UUID PRIMARY KEY,
    clerk_id VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    industry VARCHAR(255),
    company_website VARCHAR(255),
    profile_bio TEXT,
    business_tier VARCHAR(50) DEFAULT 'Silver',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employer_clerk_id ON employer_profiles(clerk_id);
