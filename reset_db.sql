-- Reset Script for trusthire_db
-- 1. Kick everyone off
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'trusthire_db'
  AND pid <> pg_backend_pid();

-- 2. Drop and Recreate
DROP DATABASE IF EXISTS trusthire_db;
CREATE DATABASE trusthire_db;
GRANT ALL PRIVILEGES ON DATABASE trusthire_db TO trusthire_user;

-- 3. Connect to the new database and fix schema permissions
\c trusthire_db
GRANT ALL ON SCHEMA public TO trusthire_user;
ALTER SCHEMA public OWNER TO trusthire_user;
