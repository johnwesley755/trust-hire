-- TrustHire Monolith Database Schema
-- Database Name: trusthire_monolith_db

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS user_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    phone_number VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'WORKER',
    email_verified BOOLEAN DEFAULT false,
    onboarded BOOLEAN DEFAULT false,
    reset_token TEXT,
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    skills TEXT,
    experience_years INT DEFAULT 0,
    level VARCHAR(10) DEFAULT 'L1',
    level_number INT DEFAULT 1,
    skill_score FLOAT DEFAULT 30.0,
    experience_score FLOAT DEFAULT 0.0,
    performance_score FLOAT DEFAULT 0.0,
    reliability_score FLOAT DEFAULT 0.0,
    level_score FLOAT DEFAULT 0.0,
    trust_score INT DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    profile_views BIGINT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    location VARCHAR(255),
    city VARCHAR(255),
    address TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    duration_minutes INT NOT NULL,
    points INT DEFAULT 100,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option INT NOT NULL,
    points INT DEFAULT 10,
    complexity_score INT DEFAULT 1,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS skill_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id VARCHAR(255) NOT NULL,
    test_id UUID NOT NULL REFERENCES skill_tests(id),
    score INT NOT NULL,
    passed BOOLEAN NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    industry VARCHAR(100),
    company_website TEXT,
    profile_bio TEXT,
    business_tier VARCHAR(50),
    is_verified BOOLEAN DEFAULT false,
    location VARCHAR(255),
    city VARCHAR(255),
    address TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    experience_years_required INT,
    budget DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'OPEN',
    location VARCHAR(255),
    city VARCHAR(255),
    address TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_required_skills (
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    worker_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    cover_letter TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_search_index (
    job_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    location VARCHAR(255),
    city VARCHAR(255),
    address TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    level VARCHAR(20),
    required_skills VARCHAR(255),
    budget FLOAT8,
    status VARCHAR(50),
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS worker_search_index (
    user_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    skills TEXT,
    location VARCHAR(255),
    city VARCHAR(255),
    latitude FLOAT8,
    longitude FLOAT8,
    level VARCHAR(10),
    is_verified BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size BIGINT,
    owner_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id VARCHAR(255) NOT NULL,
    ratee_id VARCHAR(255) NOT NULL,
    job_id UUID NOT NULL,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    doc_image_url TEXT,
    live_image_url TEXT,
    status VARCHAR(20) DEFAULT 'NONE',
    confidence_score VARCHAR(50),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_worker_profiles_user_id ON worker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_user_id ON employer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_worker_id ON job_applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_ratee_id ON ratings(ratee_id);
CREATE INDEX IF NOT EXISTS idx_skill_test_results_worker_id ON skill_test_results(worker_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_user_id ON verification_records(user_id);
CREATE INDEX IF NOT EXISTS idx_job_search_category ON job_search_index(category);
CREATE INDEX IF NOT EXISTS idx_job_search_city ON job_search_index(city);
CREATE INDEX IF NOT EXISTS idx_job_search_status ON job_search_index(status);

-- Permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO trusthire_user;

-- Initial Seed Data: Admin User
INSERT INTO user_metadata (
    id,
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role, 
    email_verified, 
    onboarded, 
    created_at, 
    updated_at
) VALUES (
    gen_random_uuid(),
    'johnwesley8113@gmail.com',
    '$2b$12$ExN/8eD7fPFbW7XztNvCtO4cQ80HuT2QeCmm4IG9rhUDreFjdFzoW', -- demo@123
    'Admin',
    'User',
    'ADMIN',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
