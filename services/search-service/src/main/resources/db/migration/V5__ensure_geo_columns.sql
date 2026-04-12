-- Ensure latitude and longitude columns exist in job_search_index
ALTER TABLE job_search_index ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE job_search_index ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Ensure latitude and longitude columns exist in worker_search_index as well
ALTER TABLE worker_search_index ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE worker_search_index ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
