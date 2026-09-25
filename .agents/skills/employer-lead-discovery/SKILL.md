---
name: employer-lead-discovery
description: Domain guide, data models, deduplication algorithms, and operational workflows for TrustHire's Employer Lead Discovery & BD acquisition module.
---

# TrustHire: Employer Lead Discovery Skill Guide

## 1. Overview
The **Employer Lead Discovery** capability enables TrustHire to ethically ingest external blue-collar/trade hiring signals, resolve company entities, extract legitimate corporate contact channels, and manage lead lifecycles in the Admin Command Center (`/admin/leads`) for business development outreach and employer onboarding.

---

## 2. Database Models & Schema (PostgreSQL)

### `employer_leads`
Stores discovered hiring organizations.
* **`id`**: UUID primary key.
* **`company_name`**: Public/trading name of the employer.
* **`normalized_name`**: Lowercase alphanumeric name with corporate suffixes stripped (`Pvt Ltd`, `LLC`, `Corp`, etc.).
* **`company_domain`**: Normalized apex domain (`example.com`).
* **`company_website`**: Full corporate website URL.
* **`industry`**: Sector/trade domain (Hospitality, Construction, Logistics, etc.).
* **`city`, `state`, `address`**: Workplace location.
* **`official_email`, `official_phone`, `contact_page_url`**: Verified corporate contact points.
* **`contactability_score`**: Enum string `COMPLETE` | `PARTIAL` | `UNCONTACTABLE`.
* **`status`**: Lifecycle state: `DISCOVERED` $\rightarrow$ `REVIEWING` $\rightarrow$ `VERIFIED` $\rightarrow$ `CONTACTABLE` $\rightarrow$ `CONTACTED` $\rightarrow$ `RESPONDED` $\rightarrow$ `INTERESTED` $\rightarrow$ `ONBOARDED` $\rightarrow$ `INVALID` | `DUPLICATE` | `EXPIRED` | `NOT_INTERESTED`.
* **`trusthire_employer_id`**: Linked `employer_profiles.id` upon 1-click conversion.

### `employer_lead_requirements`
Stores individual job/worker requirements associated with an employer lead.
* **`id`**: UUID primary key.
* **`lead_id`**: Foreign key to `employer_leads.id` (`ON DELETE CASCADE`).
* **`title`**: Role title (e.g., "Commercial Electrician", "Delivery Driver").
* **`workers_needed`**: Quantity of workers needed.
* **`salary_range`**: Stated pay range or daily wage.
* **`source_name`**: Source platform name (e.g., "Direct Career Portal", "Public ATS Feed").
* **`source_url`**: Canonical URL preserving proof of original listing.
* **`source_hash`**: `SHA256(lead_id + normalized_title + city + salary_bracket)`.
* **`is_verified`**: Whether admin verified the active job requirement.
* **`discovered_at`**, **`last_seen_at`**: Timestamps tracking freshness.
* **`status`**: `OPEN` | `FILLED` | `EXPIRED` | `ARCHIVED`.

### `lead_outreach_logs`
Logs BD team interactions.
* **`id`**: UUID primary key.
* **`lead_id`**: Foreign key to `employer_leads.id` (`ON DELETE CASCADE`).
* **`admin_id`**: Admin user identifier.
* **`channel`**: `PHONE` | `EMAIL` | `IN_PERSON` | `CONTACT_FORM`.
* **`contact_target`**: Name or designation of person reached.
* **`notes`**: Detailed call notes.
* **`outcome`**: `INTERESTED` | `FOLLOW_UP` | `NOT_INTERESTED` | `NO_ANSWER`.
* **`contacted_at`**: Timestamp.

---

## 3. Deduplication & Ingestion Rules
1. **Employer Deduplication**:
   - Check `company_domain` first (apex domain equality).
   - Fallback: match `normalized_name + city`.
2. **Requirement Deduplication**:
   - If `source_hash` exists under the same `lead_id`, update `last_seen_at = NOW()` and `source_url` rather than creating duplicate records.
3. **Contactability Scoring**:
   - `COMPLETE`: Has verified direct business contact (`official_email` or `official_phone`) AND verified web presence (`company_website` or `contact_page_url`).
   - `PARTIAL`: Has partial contact or web presence.
   - `UNCONTACTABLE`: Lacks both contact channels and web presence.

---

## 4. API Endpoints
All endpoints mounted at `/api/admin/leads` and guarded with `authenticateJWT` + `requireAdmin`:
* `GET /api/admin/leads` — Query leads with filtering (`status`, `contactability`, `city`, `q`, `limit`, `offset`).
* `GET /api/admin/leads/stats` — Aggregate metrics for KPI cards.
* `POST /api/admin/leads/ingest` — Single lead ingestion with deduplication.
* `POST /api/admin/leads/batch-ingest` — Bulk CSV/JSON lead ingestion.
* `PATCH /api/admin/leads/:id/status` — Status transition.
* `POST /api/admin/leads/:id/outreach` — Record outreach log.
* `POST /api/admin/leads/:id/convert` — 1-click convert into active `employer_profiles` account.
