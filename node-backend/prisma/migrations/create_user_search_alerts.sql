-- Migration: create_user_search_alerts.sql
CREATE TABLE IF NOT EXISTS user_search_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL DEFAULT 'JOB_ALERT', -- 'JOB_ALERT' or 'CANDIDATE_ALERT'
    title VARCHAR(255) NOT NULL,                         -- e.g., "Electrician in Chennai"
    query VARCHAR(255),                                  -- keyword search query
    city VARCHAR(255),                                   -- location filter
    category VARCHAR(100),                               -- industry / trade filter
    min_salary DECIMAL(10, 2),                           -- salary expectation
    max_salary DECIMAL(10, 2),
    experience VARCHAR(50),                              -- experience bracket ('0-1', '1-3', '3-5', '5+')
    is_active BOOLEAN NOT NULL DEFAULT true,
    frequency VARCHAR(50) NOT NULL DEFAULT 'INSTANT',    -- 'INSTANT' or 'DAILY'
    last_notified_at TIMESTAMP,
    match_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_search_alerts_user_id ON user_search_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_search_alerts_active_type ON user_search_alerts(is_active, alert_type);
CREATE INDEX IF NOT EXISTS idx_user_search_alerts_city ON user_search_alerts(city);
CREATE INDEX IF NOT EXISTS idx_user_search_alerts_category ON user_search_alerts(category);
CREATE INDEX IF NOT EXISTS idx_user_search_alerts_cooldown ON user_search_alerts(last_notified_at);
