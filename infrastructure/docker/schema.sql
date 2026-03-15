-- Initial TrustHire Schema for Neon DB
-- Run this in your Neon SQL Editor

-- Extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Common Metadata Table (Mirrors Clerk user data)
CREATE TABLE IF NOT EXISTS user_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url TEXT,
    role VARCHAR(50) CHECK (role IN ('WORKER', 'EMPLOYER', 'ADMIN')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Schemas (Organization)
CREATE SCHEMA IF NOT EXISTS worker_service;
CREATE SCHEMA IF NOT EXISTS employer_service;
CREATE SCHEMA IF NOT EXISTS job_service;
CREATE SCHEMA IF NOT EXISTS rating_service;
CREATE SCHEMA IF NOT EXISTS verification_service;
