-- ==============================================================================
-- TrustHire Production Migration: Worker Onboarding, Profiles & Sync Schema
-- Run this in your production PostgreSQL / Neon database console
-- ==============================================================================

-- 1. Ensure worker_profiles has all updated onboarding, education, and scoring columns
ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS skills TEXT,
  ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'L1',
  ADD COLUMN IF NOT EXISTS level_number INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS skill_score DOUBLE PRECISION DEFAULT 30.0,
  ADD COLUMN IF NOT EXISTS experience_score DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS performance_score DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS reliability_score DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS level_score DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS trust_score INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS profile_views BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS city VARCHAR(255),
  ADD COLUMN IF NOT EXISTS area VARCHAR(255),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS dob DATE,
  ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS willing_to_relocate BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS preferred_cities TEXT,
  ADD COLUMN IF NOT EXISTS highest_education VARCHAR(100),
  ADD COLUMN IF NOT EXISTS is_pursuing_education BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS college_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS degree VARCHAR(100),
  ADD COLUMN IF NOT EXISTS specialization VARCHAR(100),
  ADD COLUMN IF NOT EXISTS school_medium VARCHAR(50),
  ADD COLUMN IF NOT EXISTS english_proficiency VARCHAR(50),
  ADD COLUMN IF NOT EXISTS languages_known TEXT,
  ADD COLUMN IF NOT EXISTS preferred_roles TEXT,
  ADD COLUMN IF NOT EXISTS resume_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS abscond_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_jobs INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_jobs INT DEFAULT 0;

-- 2. Ensure employer_profiles has all location and verification columns
ALTER TABLE employer_profiles
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS business_tier VARCHAR(50) DEFAULT 'STARTER',
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS city VARCHAR(255),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 3. Ensure jobs table has employer_name & expires_at columns
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS employer_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP(6);

-- 4. Ensure user_metadata.profile_image_url supports full URLs / base64
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_metadata' AND column_name = 'profile_image_url'
  ) THEN
    ALTER TABLE user_metadata ALTER COLUMN profile_image_url TYPE TEXT;
  END IF;
END $$;

-- 5. Create Performance Indexes for Search & Hyperlocal Discovery
CREATE INDEX IF NOT EXISTS idx_worker_profiles_city_area ON worker_profiles(city, area);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_user_id ON worker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_user_id ON employer_profiles(user_id);
