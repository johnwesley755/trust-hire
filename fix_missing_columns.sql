-- [DATABASE: trusthire_employer_db]
\c trusthire_employer_db;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(255);

-- [DATABASE: trusthire_worker_db]
\c trusthire_worker_db;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(255);

-- [DATABASE: trusthire_job_db]
\c trusthire_job_db;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS city VARCHAR(255); 
