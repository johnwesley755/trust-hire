-- Add city column to job search index
ALTER TABLE job_search_index ADD COLUMN IF NOT EXISTS city VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_job_search_city ON job_search_index(city);

-- Add city column to worker search index
ALTER TABLE worker_search_index ADD COLUMN IF NOT EXISTS city VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_worker_search_city ON worker_search_index(city);
