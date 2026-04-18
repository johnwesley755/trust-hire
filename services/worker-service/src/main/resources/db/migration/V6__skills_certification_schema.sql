-- [DATABASE: trusthire_worker_db]
-- Migration: V6__skills_certification_schema.sql
-- Description: Adds tables for skill tests and leveling scores

-- 1. Alter worker_profiles to add scoring fields
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS skill_score DOUBLE PRECISION DEFAULT 30.0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS experience_score DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS performance_score DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS reliability_score DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS level_score DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS level_number INTEGER DEFAULT 1;

-- 2. Create skill_tests table
CREATE TABLE IF NOT EXISTS skill_tests (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    points INTEGER DEFAULT 100,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create skill_test_questions table
CREATE TABLE IF NOT EXISTS skill_test_questions (
    id UUID PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings
    correct_option INTEGER NOT NULL, -- 0-3
    points INTEGER DEFAULT 10,
    complexity_score INTEGER DEFAULT 1, -- AI future-proofing
    metadata JSONB DEFAULT '{}'::jsonb -- AI future-proofing
);

-- 4. Create skill_test_results table
CREATE TABLE IF NOT EXISTS skill_test_results (
    id UUID PRIMARY KEY,
    worker_id VARCHAR(255) NOT NULL, -- Subject from JWT
    test_id UUID NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seed initial certification tests
-- L1 Test
INSERT INTO skill_tests (id, title, category, difficulty, duration_minutes, points, description)
VALUES ('11111111-1111-1111-1111-111111111111', '🌱 L1: Platform Basics', 'General', 'Beginner', 10, 100, 'Master the TrustHire platform flows.');

-- L2 Test
INSERT INTO skill_tests (id, title, category, difficulty, duration_minutes, points, description)
VALUES ('22222222-2222-2222-2222-222222222222', '⚡ L2: Health & Safety', 'Safety', 'Intermediate', 20, 200, 'Essential workplace safety protocols.');

-- L3 Test
INSERT INTO skill_tests (id, title, category, difficulty, duration_minutes, points, description)
VALUES ('33333333-3333-3333-3333-333333333333', '🌟 L3: Professionalism & Ethics', 'General', 'Advanced', 30, 300, 'Advanced workspace behavior and ethics.');

-- 6. Seed Sample Questions for L1 Test
INSERT INTO skill_test_questions (id, test_id, question_text, options, correct_option, points)
VALUES (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 
'How do you confirm a job completion on TrustHire?', 
'["Call the boss", "Upload a completion photo", "Just leave", "Wait for 24 hours"]', 
1, 50);

INSERT INTO skill_test_questions (id, test_id, question_text, options, correct_option, points)
VALUES (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 
'What is the benefit of reaching Level 3?', 
'["Free tea", "Lower fees", "Higher salary range & Star badge", "No benefits"]', 
2, 50);
