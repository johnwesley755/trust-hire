# TrustHyre — The Verified On-Demand Skilled Workforce Network

> **"Own the Shift. Show Up, Get Paid."**  
> TrustHyre is a full-stack, enterprise-grade talent marketplace and workforce deployment platform designed to eliminate no-shows, identity fraud, and payment disputes across India's skilled trade, frontline, and blue-collar industries.

---

## 🌟 1. Executive Summary & Application Overview

In the skilled trade and frontline labor market, traditional job portals fail due to three critical friction points:
1. **Attendance Disputes & No-Shows**: Employers face sudden worker absences, fabricated time logs, and unreliable staffing.
2. **Identity & Skill Discrepancies**: Lack of rigorous identity proof leads to credential misrepresentation and workplace compliance risks.
3. **Wage Delay & Lack of Transparency**: Workers frequently face wage withholding, arbitrary deductions, and weeks of delayed compensation.

**TrustHyre bridges this gap** by combining:
- **Biometric & Aadhaar-backed identity authentication**,
- **Geofenced shift punch-in/out**,
- **Automated UPI Escrow milestone settlements**, and
- **Objective skill-level certifications**.

The platform powers end-to-end recruitment, rapid shift dispatching (averaging 15-minute dispatch readiness), and verified workforce management across both mobile and desktop devices.

---

## 🛡️ 2. The Four Core Pillars of Trust

```
                   ┌─────────────────────────────────────────┐
                   │               TRUSTHYRE                 │
                   │        Core Pillars of Trust            │
                   └────────────────────┬────────────────────┘
                                        │
     ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
     ▼                  ▼                               ▼                  ▼
┌───────────────┐ ┌───────────────┐             ┌───────────────┐ ┌───────────────┐
│  Aadhaar &    │ │   Geofenced   │             │   Automated   │ │  Skill Level  │
│   Biometric   │ │   Precision   │             │  UPI Escrow   │ │ Progression & │
│  Verification │ │  Attendance   │             │  Settlements  │ │ Assessments   │
└───────────────┘ └───────────────┘             └───────────────┘ └───────────────┘
```

### 1. 🆔 Aadhaar & Facial Biometric Verification
- Every worker undergoes strict identity validation including government ID (Aadhaar) verification and facial biometric matching.
- Guarantees 100% pre-screened personnel and eliminates proxy workers.

### 2. 📍 Geofenced Precision Attendance
- Workers clock in and out using mobile GPS verification bounded directly to the employer's designated facility, site, or warehouse coordinates.
- Prevents false punch-ins and provides immutable proof of attendance.

### 3. ⚡ Smart Escrow Vault & Instant UPI Settlements
- Employers lock project funds or shift compensation securely in escrow before shifts commence.
- Once a shift or milestone is approved, daily wages are disbursed directly to the worker's UPI ID, guaranteeing timely compensation and eliminating wage disputes.

### 4. 🏅 Standardized Skill-Level Progression
- Workers earn verifiable skill badges (Levels 1 through 5) through practical evaluations and employer review history.
- Distinguishes apprentice helpers from seasoned master craftsmen (e.g., Line Cook vs. Executive Sous Chef; Wireman vs. High-Voltage Certified Technician).

---

## 👥 3. Platform Personas & Operational Workflows

TrustHyre provides specialized, purpose-built interfaces tailored to each stakeholder:

### 👷 A. Skilled Professionals (Job Seekers / Workers)
- **Unified Onboarding**: Rapid sign-up with Indian mobile verification (`+91`), trade category selection, and credential uploads.
- **Identity & Skill Badging**: Complete digital Aadhaar checks, photo biometric capture, and interactive skill assessments to unlock higher wage brackets.
- **Shift Discovery**: Search and apply for local, verified hourly, daily, or full-time opportunities with upfront wage transparency.
- **Shift Execution**: Mobile geofence check-in, real-time shift timers, and task milestone completion.
- **Instant Earnings**: Real-time wallet view showing escrow-backed balances, immediate UPI payouts, and complete payout history.
- **Dynamic PDF Resume Builder**: Generates standardized, verified TrustHyre resume documents featuring verifiable QR codes, skill levels, and attendance metrics.

### 🏢 B. Employers & Enterprises
- **Direct Workforce Dispatch**: Request emergency or planned shift deployments across core sectors within minutes.
- **Verified Candidate Search**: Filter talent by proximity, specific technical trade, verified biometric level, and past employer performance ratings.
- **Job Lifecycle & ATS**: Create rich job postings, manage applicant pipelines, review verified candidate credentials, and schedule interview/dispatch slots.
- **Escrow Wage Vault**: Pre-fund shifts into escrow, review geofenced shift attendance logs, and approve settlements with a single click.
- **Team & Site Management**: Multi-location support for warehouses, hotel chains, construction sites, and manufacturing plants.

### 🛡️ C. Platform Administrators (Trust & Compliance Hub)
- **Verification Command Center**: Review pending Aadhaar submissions, identity confidence scores, and background clearance documents.
- **Employer Lead Discovery & Acquisition**: Automated ingestion, entity deduplication, and contactability scoring for enterprise outreach and BD pipelines.
- **Dispute Resolution & Audit**: Real-time audit logs for shift discrepancies, escrow hold resolutions, and community rating moderation.

---

## 🏭 4. Core Workforce Sectors & Trades

TrustHyre specializes in high-demand, mission-critical operational trades:

| Sector | Key Roles Deployed | Industry Verticals |
| :--- | :--- | :--- |
| **Commercial Culinary & Hospitality** | Executive Chefs, Line Cooks, Kitchen Supervisors, Banquet Crews | Cloud Kitchens, Hotels, Fine Dining, Catering |
| **Electrical & Industrial Wiring** | Licensed Electricians, Panel Assemblers, High-Voltage Technicians, Maintenance Wiremen | Commercial Buildings, Industrial Units, Substations |
| **Warehouse Logistics & Fleet** | Forklift Operators, Inventory Controllers, Packaging Crews, Delivery Fleet | E-Commerce Hubs, 3PL Facilities, Cold Storage |
| **Commercial Plumbing & Pipefitting** | Certified Plumbers, Drainage Specialists, Pipeline Welders, Water Plant Techs | Infrastructure Projects, Commercial Towers |
| **Construction, Carpentry & Masonry** | Structural Carpenters, Masons, Drywall Finishers, Civil Technicians | Residential & Commercial Real Estate, Infrastructure |
| **Facility Security & Site Protection** | Licensed Security Guards, Access Controllers, Perimeter Monitors, Safety Officers | Corporate Tech Parks, Gated Complexes, Warehouses |
| **Commercial Sanitation & Hygiene** | Industrial Deep Cleaners, Waste Handlers, Hospital Grade Sanitation Staff | Healthcare Facilities, Airports, Commercial Malls |

---

## 💻 5. Application Architecture & Technology Blueprint

TrustHyre is built as a high-performance modern web application consisting of a responsive client experience and a resilient backend:

```text
trust-hire-v2/
├── frontends/
│   └── unified-pwa/              # Unified Progressive Web Application (React 19 + Vite)
│       ├── src/
│       │   ├── modules/auth/     # Full-screen framed auth suite (Sign In, Sign Up, Recovery)
│       │   ├── modules/landing/  # Editorial landing experience & design system
│       │   ├── modules/jobs/     # Job posting, search, and application management
│       │   ├── modules/profile/  # Biometric onboarding, Aadhaar step, resume PDF engine
│       │   ├── modules/admin/    # Admin command center, verifications, lead acquisition
│       │   └── providers/        # Auth context, theme, and API client state
├── node-backend/                 # Core backend application (Node.js + Hono)
│   ├── prisma/                   # PostgreSQL schema, migrations, and seeds
│   ├── src/
│   │   ├── config/               # Prisma client, Firebase, environment integrations
│   │   ├── controllers/          # Auth, workers, jobs, leads, and media controllers
│   │   ├── middlewares/          # JWT auth guards, rate limiting, and input validators
│   │   └── utils/                # Standardized API response wrappers, email templates
└── docs/                         # Domain knowledge, lead discovery workflows, design specs
```

### Key Technical Capabilities
- **Frontend Stack**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, and `@react-pdf/renderer` for high-fidelity client-side document generation.
- **Design System**: Luxury editorial aesthetics utilizing the `Onest` typography scale, deep navy colorways (`#0f2f63`, `#2563c9`, `#5790e6`), pill controls, and responsive framed viewports.
- **Backend Stack**: Node.js with Hono web framework, Prisma ORM, and PostgreSQL for relational integrity.
- **Cloud Integrations**:
  - **Cloudinary**: Real-time image optimization and biometric asset storage.
  - **Brevo**: Transactional email notifications and OTP delivery.
  - **Firebase Admin & Google Cloud**: Authentication tokens and push notification delivery.

---

## 🔒 6. Security, Compliance & Governance

- **Zero Credential Exposure**: Service accounts, JWT secrets, and API credentials are strictly managed through environment variables (`.env`) with automated Git prevention rules (`.gitignore`).
- **Role-Based Access Control (RBAC)**: Strict segregation between `WORKER`, `EMPLOYER`, and `ADMIN` operational scopes.
- **Rate Limiting & Threat Shield**: Built-in in-memory rate limiting and request sanitization across all public authentication endpoints.
- **Data Privacy**: Masked Aadhaar storage, encrypted authentication tokens, and strict audit logging.

---

© 2026 TrustHyre Network. All Rights Reserved.  
*Building India's Most Trusted Skilled Workforce Infrastructure.*
