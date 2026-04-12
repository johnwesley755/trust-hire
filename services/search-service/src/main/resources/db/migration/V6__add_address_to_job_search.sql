-- Add missing address column to job_search_index table
ALTER TABLE job_search_index ADD COLUMN IF NOT EXISTS address TEXT;
