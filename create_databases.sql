-- Create Databases for TrustHire Microservices
CREATE DATABASE trusthire_auth_db;
CREATE DATABASE trusthire_employer_db;
CREATE DATABASE trusthire_worker_db;
CREATE DATABASE trusthire_job_db;
CREATE DATABASE trusthire_media_db;
CREATE DATABASE trusthire_notification_db;
CREATE DATABASE trusthire_rating_db;
CREATE DATABASE trusthire_verification_db;
CREATE DATABASE trusthire_search_db;

-- Grant Privileges to trusthire_user
GRANT ALL PRIVILEGES ON DATABASE trusthire_auth_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_employer_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_worker_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_job_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_media_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_notification_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_rating_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_verification_db TO trusthire_user;
GRANT ALL PRIVILEGES ON DATABASE trusthire_search_db TO trusthire_user;
