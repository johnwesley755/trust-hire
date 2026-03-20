# TrustHire v2 - Professional Network for Skilled Workers

TrustHire is a modern, microservices-based career platform designed to connect verified skilled workers with professional employers. This repository contains the complete ecosystem, including 10+ backend microservices and dual Progressive Web Applications (PWAs).

## 🏗️ System Architecture

TrustHire follows a **distributed microservices architecture** orchestrated by a centralized API Gateway.

- **API Gateway**: The single entry point for all frontend requests, handling routing and prefix stripping.
- **Frontend PWAs**: Two independent React applications (one for Workers, one for Employers) optimized for mobile-first professional experiences.
- **Backend Services**: Specialized Spring Boot microservices managing domain-specific logic (Auth, Jobs, Ratings, etc.).
- **Data Layer**: Service-specific PostgreSQL databases for strict isolation and scalability.

## 🔌 Port Mapping & Services

| Service | Internal Port | Gateway Route (`/api/v1/api/...`) | Description |
| :--- | :--- | :--- | :--- |
| **API Gateway** | **9000** | `/` | Central Entry Point |
| `auth-service` | 8081 | `auth/**` | JWT Auth, User Profiles, Roles |
| `worker-service` | 8082 | `worker/**`, `levels/**` | Worker Profiles, Levels, Skills |
| `employer-service`| 8083 | `employer/**` | Employer Profiles, Verification |
| `job-service` | 8084 | `jobs/**` | Job Lifecycle, Matchings |
| `verification-service`| 8085 | `verification/**` | Aadhaar & Identity Verification |
| `rating-service` | 8086 | `ratings/**` | Worker & Employer Reviews |
| `notification-service` | 8087 | `notifications/**` | WebSocket (WS) & Push Alerts |
| `search-service` | 8088 | `search/**` | High-performance Job Search |
| `media-service` | 8089 | `media/**` | Cloudinary Image/Video Uploads |
| `scoring-engine` | 5000 | (Internal AI) | Trust/Level Score Calculations |
| `face-match` | 5001 | (Internal AI) | Biometric Identity Verification |

### Frontends
- **Employer PWA**: [http://localhost:5173](http://localhost:5173)
- **Worker PWA**: [http://localhost:5174](http://localhost:5174)

## 🗄️ Database Structure

The system uses **PostgreSQL 16+** with individual databases for each service to ensure data integrity and isolation.

- `trusthire_auth_db`: User metadata, credentials, and tokens.
- `trusthire_employer_db`: Business profiles and tiers.
- `trusthire_worker_db`: Worker profiles, levels, and skills.
- `trusthire_job_db`: Job postings, applications, and requirements.
- `trusthire_media_db`: Asset tracking and Cloudinary metadata.
- `trusthire_verification_db`: Identity records and confidence scores.
- `trusthire_rating_db`: Multi-dimensional reviews.
- `trusthire_notification_db`: Alert logs and read statuses.
- `trusthire_search_db`: Denormalized job search index.

## 🛠️ Technology Stack

- **Backends**: Spring Boot 3.2 (Java 21), Maven, Spring Gateway.
- **Frontends**: React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Security**: Custom JWT Authentication (Role-based access control).
- **Communication**: REST (JSON), WebSocket (STOMP via SockJS).
- **External Dependencies**: 
    - **Brevo**: Email & Transactional SMS.
    - **Cloudinary**: Media Hosting & Optimization.
    - **Firebase**: FCM Push Notifications.

## 📂 Project Directory Structure

```text
trust-hire-v2/
├── services/               # Backend Microservices (Maven/Java)
│   ├── auth-service/       # Identity & JWT Management
│   ├── gateway-service/    # Port 9000 API Gateway
│   └── ...                 # Other domain-specific services
├── frontends/              # Frontend Applications (React/Vite)
│   ├── employer-pwa/       # PWA for Businesses/Hiring
│   └── worker-pwa/         # PWA for Skilled Professionals
├── docs/                   # Detailed Architecture & API specs
├── infrastructure/         # Deployment scripts & configs
└── .env                    # Centralized environment configuration
```

## 🚀 Getting Started

1. **Environment**: Copy `.env.example` to `.env` and fill in secrets.
2. **Databases**: Run `initialize_schema.sql` on your PostgreSQL instance.
3. **Backend**: Navigate to each folder in `services/` and run `mvn spring-boot:run`.
4. **Frontend**: Navigate to `frontends/worker-pwa` or `employer-pwa` and run `npm install && npm run dev`.

---
© 2026 TrustHire Network. All Rights Reserved.
