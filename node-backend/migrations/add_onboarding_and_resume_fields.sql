-- Migration: Add detailed candidate onboarding and resume builder fields to worker_profiles
ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS dob DATE,
  ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS area VARCHAR(255),
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
  ADD COLUMN IF NOT EXISTS resume_url VARCHAR(500);

-- Also ensure user_metadata.profile_image_url can store longer strings/data
ALTER TABLE user_metadata ALTER COLUMN profile_image_url TYPE TEXT;

-- Create index on city and area for fast hyperlocal search
CREATE INDEX IF NOT EXISTS idx_worker_profiles_city_area ON worker_profiles(city, area);

