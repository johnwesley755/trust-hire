-- Migration to remove redundant owner_id column created by Hibernate ddl-auto
-- Standardizing on owner_clerk_id as defined in V1 migration

ALTER TABLE media_assets DROP COLUMN IF EXISTS owner_id;
