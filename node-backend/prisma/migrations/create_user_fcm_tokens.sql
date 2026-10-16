-- Migration: Create user_fcm_tokens table and ensure notification deep link support
-- Safe for both local and production PostgreSQL databases (idempotent IF NOT EXISTS)

-- 1. Create table for storing multi-device Firebase Cloud Messaging (FCM) tokens
CREATE TABLE IF NOT EXISTS user_fcm_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    device_type VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Index user_id for high-performance multicast push lookups
CREATE INDEX IF NOT EXISTS idx_user_fcm_tokens_user_id ON user_fcm_tokens(user_id);

-- 3. Ensure notifications table has the optional link column for 1-click deep routing
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link VARCHAR(255);
