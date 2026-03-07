-- Hardened Migration: Idempotently add missing columns to worker_profiles
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS level VARCHAR(50);
