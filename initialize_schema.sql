-- TrustHire Schema Initialization Script
-- Use these commands to manually create tables in your respective databases

-- [DATABASE: trusthire_auth_db]
\c trusthire_auth_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS user_metadata (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone_number VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url VARCHAR(255),
    role VARCHAR(50),
    email_verified BOOLEAN DEFAULT FALSE,
    onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;

-- [DATABASE: trusthire_employer_db]
\c trusthire_employer_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS employer_profiles (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    industry VARCHAR(255),
    company_website VARCHAR(255),
    profile_bio TEXT,
    business_tier VARCHAR(50),
    location VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address VARCHAR(255),
    city VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;

-- [DATABASE: trusthire_worker_db]
\c trusthire_worker_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS worker_profiles (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    location VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    level VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(255),
    bio TEXT,
    skills TEXT,
    experience_years INTEGER,
    hourly_rate NUMERIC(10, 2),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;

-- [DATABASE: trusthire_job_db]
\c trusthire_job_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY,
    employer_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(255),
    experience_years_required INTEGER,
    budget NUMERIC(10, 2),
    location VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address VARCHAR(255),
    city VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_required_skills (
    job_id UUID NOT NULL,
    skill VARCHAR(255),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    cover_letter TEXT,
    applied_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;
-- [DATABASE: trusthire_job_db] ... (rest of the file)

-- [DATABASE: trusthire_media_db]
\c trusthire_media_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size BIGINT,
    owner_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_media_owner ON media_assets(owner_id);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;

-- [DATABASE: trusthire_verification_db]
\c trusthire_verification_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    doc_image_url VARCHAR(500),
    live_image_url VARCHAR(500),
    status VARCHAR(50) NOT NULL,
    confidence_score VARCHAR(50),
    failure_reason TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;

-- [DATABASE: trusthire_rating_db]
\c trusthire_rating_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY,
    reviewer_id VARCHAR(255) NOT NULL,
    ratee_id VARCHAR(255) NOT NULL,
    job_id UUID NOT NULL,
    score INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_ratings_ratee ON ratings(ratee_id);
CREATE INDEX IF NOT EXISTS idx_ratings_reviewer ON ratings(reviewer_id);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;

-- [DATABASE: trusthire_notification_db]
\c trusthire_notification_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(user_id);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;
-- [DATABASE: trusthire_notification_db] ... (rest of the file)

-- [DATABASE: trusthire_search_db]
\c trusthire_search_db;
GRANT ALL ON SCHEMA public TO trusthire_user;
CREATE TABLE IF NOT EXISTS job_search_index (
    job_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    location VARCHAR(255),
    budget DOUBLE PRECISION,
    budget_type VARCHAR(50),
    employer_id VARCHAR(255),
    status VARCHAR(50),
    indexed_at TIMESTAMP WITHOUT TIME ZONE,
    last_updated_at TIMESTAMP WITHOUT TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_job_search_category ON job_search_index(category);
CREATE INDEX IF NOT EXISTS idx_job_search_status ON job_search_index(status);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trusthire_user;
