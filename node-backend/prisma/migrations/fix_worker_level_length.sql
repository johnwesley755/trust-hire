-- Fix: Increase level column length in worker_profiles and worker_search_index to prevent truncation errors
ALTER TABLE worker_profiles ALTER COLUMN level TYPE VARCHAR(50);
ALTER TABLE worker_search_index ALTER COLUMN level TYPE VARCHAR(50);
