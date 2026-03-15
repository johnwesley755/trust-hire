-- Database Permission Fix for TrustHire
-- Required for PostgreSQL 15+ 

-- Connect to each database and grant USAGE and CREATE permissions on the public schema 
-- to the trusthire_user.

\c trusthire_auth_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

\c trusthire_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

\c trusthire_employer_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

\c trusthire_worker_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

\c trusthire_job_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

\c trusthire_verification_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

\c trusthire_notification_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

\c trusthire_media_db;
GRANT USAGE, CREATE ON SCHEMA public TO trusthire_user;

-- Verify
SELECT nspname, has_schema_privilege('trusthire_user', nspname, 'CREATE') 
FROM pg_namespace 
WHERE nspname = 'public';
