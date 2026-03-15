-- Consolidated script to remove Clerk references from all databases

-- 1. Media Service
\c trusthire_media_db
ALTER TABLE media_assets RENAME COLUMN owner_clerk_id TO owner_id;

-- 2. Verification Service
\c trusthire_verification_db
ALTER TABLE verification_records RENAME COLUMN worker_clerk_id TO user_id;

-- 3. Rating Service
\c trusthire_rating_db
ALTER TABLE ratings RENAME COLUMN reviewer_clerk_id TO reviewer_id;
ALTER TABLE ratings RENAME COLUMN ratee_clerk_id TO ratee_id;

-- 4. Notification Service
\c trusthire_notification_db
ALTER TABLE notifications RENAME COLUMN recipient_clerk_id TO user_id;

-- 5. Worker Service
\c trusthire_worker_db
ALTER TABLE worker_profiles RENAME COLUMN clerk_id TO user_id;
DROP INDEX IF EXISTS idx_worker_clerk_id;
CREATE INDEX idx_worker_user_id ON worker_profiles(user_id);

-- 6. Auth Service
\c trusthire_auth_db
ALTER TABLE user_metadata RENAME COLUMN clerk_id TO user_id;
DROP INDEX IF EXISTS idx_user_metadata_clerk_id;
CREATE INDEX idx_user_metadata_user_id ON user_metadata(user_id);

-- 7. Infrastructure (docker/schema.sql should also be updated manually)
-- Note: job-service and employer-service already seem to use generic names in their current schema.
