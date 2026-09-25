# 🏢 Hiring Company Discovery & Business Acquisition Guide (TrustHire)

> **In Plain English:**  
> This system finds real businesses and employers across the internet who are currently looking for workers (like drivers, electricians, cooks, helpers, warehouse staff). It finds their verified business phone number and email so the TrustHire team can reach out, offer pre-verified workers, and onboard the company onto TrustHire.

---

## 🎯 1. What is "Hiring Company Discovery"?

When businesses need workers, they often post job vacancies on their own company website, local business pages, or career links.

Instead of waiting for employers to discover TrustHire on their own, **Hiring Company Discovery actively discovers these employers**, identifies what workers they need, finds their verified contact details, and presents them cleanly to the TrustHire Admin team.

### The Goal:
1. **Find real hiring needs** from genuine companies.
2. **Find legitimate business contact info** (official phone, email, contact page).
3. **Contact the employer** to introduce TrustHire.
4. **Onboard them in 1-Click** so their job requirements go live for TrustHire candidates.

---

## 🔄 2. How the 4-Step Process Works

```
┌──────────────────────────┐
│   1. Automated Crawler   │ ➔ Scans career pages & job feeds for worker openings.
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ 2. Contact Verification  │ ➔ Extracts official company email, phone number & domain.
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│    3. Team Outreach      │ ➔ Admin/BD team calls the employer with verified workers.
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│  4. 1-Click Onboarding   │ ➔ Instantly creates employer profile & TrustHire job post!
└──────────────────────────┘
```

### Real-World Example:
* **Signal Found:** "ABC Restaurant in Chennai is hiring 5 Delivery Drivers."
* **Enrichment:** The crawler visits `abcrestaurant.in/contact` and extracts official contact: `044-2811xxxx` / `careers@abcrestaurant.in`.
* **Lead Ingested:** Appears in the Admin Console with **"Full Contact Info"** badge.
* **Outreach:** Admin calls: *"Hello ABC Restaurant, we saw you need 5 delivery drivers in Chennai. TrustHire has 50+ background-verified delivery drivers ready to start this week."*
* **Outcome:** ABC Restaurant says *"Great, send them over!"*
* **1-Click Convert:** Admin clicks **"Convert to Employer"**. The company is registered on TrustHire and their job requirement is published live!

---

## 🛠️ 3. How to Use the Features in Admin Console

### A. Run Auto-Discovery Scan (1-Click)
* Click the green **"Run Auto-Discovery Scan"** button at the top of the **Hiring Companies** page.
* The backend crawler visits configured public career feeds and structured data feeds (`Schema.org/JobPosting`).
* It automatically ignores duplicates and fetches new hiring companies.

### B. Quick Scrape from Any URL
* If you find any company career page, restaurant hiring link, or warehouse hiring notice:
  1. Click **"Quick Scrape URL"**.
  2. Paste the URL (e.g. `https://acme-logistics.com/careers/driver-opening`).
  3. Click **"Extract Details"**.
  4. The engine reads the page, detects the job title, company name, salary, and finds their contact email/phone.
  5. Click **"Confirm & Ingest"** to add them to your discovery pipeline.

### C. Logging Calls & Outreach
* Click **"Inspect Lead"** on any company card.
* Under **Outreach Activity**, select whether you called, emailed, or visited them.
* Enter your call notes (e.g. *"Spoke with Ramesh (HR), interested in hiring 5 drivers, follow up on Friday"*).
* Click **"Log Call"** to save a timestamped history.

### D. 1-Click Convert to TrustHire
* When a company agrees to hire through TrustHire, click **"Convert to TrustHire Employer"**.
* This automatically:
  1. Creates an active Employer account (`EMPLOYER` role).
  2. Creates their Employer Profile with company name, domain, city, and phone.
  3. Copies the worker requirement directly into TrustHire's live Job Postings table (`jobs`).
  4. Changes the lead status to `ONBOARDED`.

---

## 🛡️ 4. Data Safety, Privacy & Compliance

* **Public Information Only:** The crawler only processes publicly accessible career pages and standard `Schema.org/JobPosting` structured data.
* **Direct Business Contacts:** Extracts official business emails/phone numbers (e.g. `contact@`, `hr@`, `careers@`), filtering out generic spam or disposable addresses.
* **Polite Rate Limiting:** The crawler obeys anti-hammer delays (1.2s per domain) and concurrency caps so external servers are never overloaded.
* **Deduplication:** Uses SHA-256 fingerprinting on company domain + job title + location to prevent duplicate entries.

---

## 📊 5. Lead Status Breakdown (Plain English)

| Status Name | Meaning | Next Action |
| :--- | :--- | :--- |
| **New Discovered** (`DISCOVERED`) | A new hiring company was found by the crawler. | Check their website and verify details. |
| **Verified Contact** (`VERIFIED`) | Company and phone/email have been verified. | Call or email the employer. |
| **Contacted** (`CONTACTED`) | Your team has reached out to the employer. | Wait for response or schedule follow-up. |
| **Interested** (`INTERESTED`) | The employer wants to hire through TrustHire! | Prepare onboarding and convert them. |
| **Joined Platform** (`ONBOARDED`) | Converted into an official TrustHire employer. | Help candidates apply for their jobs. |
| **Closed / Expired** (`EXPIRED`) | Role was filled or company is not hiring. | Archived for historical records. |

---

## 💻 6. Technical Architecture & File Map

* **Database Schema:** [schema.prisma](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/node-backend/prisma/schema.prisma) (`employer_leads`, `employer_lead_requirements`, `lead_outreach_logs`).
* **SQL Migration:** [employer_lead_discovery.sql](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/node-backend/prisma/migrations/employer_lead_discovery.sql).
* **Crawler Service:** [leadCrawlerService.ts](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/node-backend/src/services/leadCrawlerService.ts).
* **Contact Enrichment Service:** [contactEnrichmentService.ts](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/node-backend/src/services/contactEnrichmentService.ts).
* **Business Logic & Conversion:** [leadService.ts](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/node-backend/src/services/leadService.ts).
* **API Endpoints:** [leadRoutes.ts](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/node-backend/src/routes/leadRoutes.ts) & [leadController.ts](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/node-backend/src/controllers/leadController.ts).
* **Admin Frontend View:** [AdminLeadsPage.tsx](file:///c:/Users/johnw/OneDrive/Desktop/GIT/trust-hire-v2/frontends/unified-pwa/src/modules/admin/pages/AdminLeadsPage.tsx).
