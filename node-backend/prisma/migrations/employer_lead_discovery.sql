-- ====================================================================
-- TrustHire: Employer Lead Discovery Schema Migration
-- Tables: employer_leads, employer_lead_requirements, lead_outreach_logs
-- Engine: PostgreSQL
-- ====================================================================

-- Ensure pgcrypto or uuid extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: employer_leads
CREATE TABLE IF NOT EXISTS "employer_leads" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_name" VARCHAR(255) NOT NULL,
    "normalized_name" VARCHAR(255) NOT NULL,
    "company_domain" VARCHAR(255),
    "company_website" TEXT,
    "industry" VARCHAR(100),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "address" TEXT,
    "official_email" VARCHAR(255),
    "official_phone" VARCHAR(50),
    "contact_page_url" TEXT,
    "contactability_score" VARCHAR(20) NOT NULL DEFAULT 'PARTIAL',
    "status" VARCHAR(50) NOT NULL DEFAULT 'DISCOVERED',
    "trusthire_employer_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

-- Indexes for employer_leads
CREATE INDEX IF NOT EXISTS "idx_employer_leads_normalized_name" ON "employer_leads" ("normalized_name");
CREATE INDEX IF NOT EXISTS "idx_employer_leads_domain" ON "employer_leads" ("company_domain");
CREATE INDEX IF NOT EXISTS "idx_employer_leads_status" ON "employer_leads" ("status");
CREATE INDEX IF NOT EXISTS "idx_employer_leads_city" ON "employer_leads" ("city");

-- 2. Table: employer_lead_requirements
CREATE TABLE IF NOT EXISTS "employer_lead_requirements" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "lead_id" UUID NOT NULL REFERENCES "employer_leads" ("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "normalized_title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "description" TEXT,
    "city" VARCHAR(100),
    "location" VARCHAR(255),
    "workers_needed" INT DEFAULT 1,
    "salary_range" VARCHAR(100),
    "source_name" VARCHAR(100) NOT NULL,
    "source_url" TEXT NOT NULL,
    "source_hash" VARCHAR(64) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "discovered_at" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
    "last_seen_at" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
    "status" VARCHAR(50) NOT NULL DEFAULT 'OPEN'
);

-- Indexes for employer_lead_requirements
CREATE INDEX IF NOT EXISTS "idx_lead_req_lead_id" ON "employer_lead_requirements" ("lead_id");
CREATE INDEX IF NOT EXISTS "idx_lead_req_source_hash" ON "employer_lead_requirements" ("source_hash");
CREATE INDEX IF NOT EXISTS "idx_lead_req_status" ON "employer_lead_requirements" ("status");

-- 3. Table: lead_outreach_logs
CREATE TABLE IF NOT EXISTS "lead_outreach_logs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "lead_id" UUID NOT NULL REFERENCES "employer_leads" ("id") ON DELETE CASCADE,
    "admin_id" VARCHAR(255) NOT NULL,
    "channel" VARCHAR(50) NOT NULL,
    "contact_target" VARCHAR(255),
    "notes" TEXT NOT NULL,
    "outcome" VARCHAR(50),
    "contacted_at" TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

-- Indexes for lead_outreach_logs
CREATE INDEX IF NOT EXISTS "idx_outreach_lead_id" ON "lead_outreach_logs" ("lead_id");
