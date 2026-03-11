-- V3: Make clerk_id nullable to support native authentication
ALTER TABLE user_metadata ALTER COLUMN clerk_id DROP NOT NULL;
