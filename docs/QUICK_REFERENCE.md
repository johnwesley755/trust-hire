# TrustHire Quick Reference Guide

## 🚀 Quick Links

- [Main README](../README.md) - Project overview
- [Architecture](ARCHITECTURE.md) - System design
- [Level System](LEVEL_SYSTEM.md) - Worker ranking
- [API Docs](API.md) - API reference
- [Deployment](DEPLOYMENT.md) - Setup guide
- [Security](SECURITY.md) - Security practices
- [AI Integration](AI_INTEGRATION.md) - AI services
- [Aadhaar Verification](AADHAAR_VERIFICATION.md) - Identity verification

## 📊 Level System Quick Reference

| Frontend (PWAs) | React + Vite (Worker & Employer) |
| Backend Core## 🧠 AI Orchestration via Make
TrustHire uses **Make** as the central hub for coordinating different AI models and verification steps.
| Identity Provider | Clerk (with Email Verification) |
| AI Services | FastAPI (Python) |
| Workflow Engine | Make (formerly Integromat) |
| Database | Neon DB + PostGIS |
| Notifications | Brevo (Email/SMS) |

**Formula**: `Score = (Skill×30%) + (Experience×25%) + (Performance×25%) + (Reliability×20%)`

## 🌐 API Quick Reference

**Base URL (Dev)**: `http://localhost:8080/api/v1`  
**Base URL (Prod)**: `https://api.trusthire.in/api/v1`

| Action | Method | Endpoint |
|--------|--------|----------|
| Google Sign-In | POST | `/auth/google-signin` |
| Login | POST | `/auth/login` |
| Refresh Token | POST | `/auth/refresh-token` |
| Search Workers | GET | `/workers/search?lat=&lng=&radius=` |
| Get Worker | GET | `/workers/{id}` |
| Update Profile | PUT | `/workers/{id}` |
| Update Availability | PUT | `/workers/{id}/availability` |
| Post Job | POST | `/jobs` |
| Search Jobs | GET | `/jobs/search` |
| Add Rating | POST | `/ratings` |
| Get Trust Score | GET | `/trust-scores/worker/{id}` |
| Get Level | GET | `/levels/worker/{id}` |
| Get Progress | GET | `/levels/progress/{id}` |
| Upload Signature | POST | `/media/upload-signature` |

**Auth Header**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

## 🏗️ Technology Stack Quick Reference

| Layer | Technology |
|-------|-----------|
| Mobile | **React Native + Expo** (dev via **Expo Go** – no Android Studio!) |
| Styling | **NativeWind v4** (Tailwind CSS for React Native) |
| Backend | **Spring Boot 3.2 (Java 21)** |
| Security | Spring Security 6 + JWT (jjwt) |
| ORM | Spring Data JPA (Hibernate) |
| Database | Neon DB (PostgreSQL) + PostGIS |
| Real-time | Spring WebSocket (STOMP/SockJS) |
| Cache | Redis (Spring Cache) |
| Rate Limiting | Bucket4j |
| Media | Cloudinary Java SDK |
| AI Service | FastAPI (Python 3.11) |
| Notifications | Firebase Admin SDK (FCM) |
| DB Migrations | Flyway |
| Monitoring | Spring Actuator + Micrometer |
| CI/CD | GitHub Actions |

## ⚙️ Backend Quick Start

```bash
# Clone and build
git clone https://github.com/yourusername/trust-hire.git
cd trust-hire/backend
mvn clean package -DskipTests

# Start with Docker Compose (includes PostgreSQL + Redis)
docker-compose up -d

# Or run locally (requires PostgreSQL + Redis running)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend runs on**: `http://localhost:8080`  
**Health check**: `http://localhost:8080/actuator/health`

## 📱 Mobile Quick Start (Expo Go)

> Install **Expo Go** on your phone — no Android Studio needed!

```bash
cd mobile
npm install
npx expo start    # Scan QR code with Expo Go app
```

**API URL** in `.env`: use your PC's local IP, not `localhost`:
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080/api/v1
```

**NativeWind v4** component example:
```tsx
<View className="bg-white rounded-xl p-4 shadow-md">
  <Text className="text-lg font-bold text-gray-900">{worker.name}</Text>
  <Text className="text-sm text-indigo-600">Level {worker.level}</Text>
</View>
```

## 🔑 JWT Tokens Quick Reference

| Token | Lifetime | Purpose |
|-------|---------|---------|
| Access Token | 15 minutes | API authorization |
| Refresh Token | 30 days | Session persistence |

**Token payload**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "WORKER",
  "authProvider": "GOOGLE"
}
```

## 🔐 Security Quick Reference

- **Authentication**: Spring Security 6 + jjwt (HS256)
- **Passwords**: BCryptPasswordEncoder (strength 12)
- **Encryption**: AES-256-GCM (Java Crypto + JPA AttributeConverter)
- **Rate Limiting**: Bucket4j (100 req/15min general, 5 req/15min auth)
- **Authorization**: `@PreAuthorize("hasRole('WORKER')")` annotations
- **HTTPS**: Enforced via Nginx + Let's Encrypt

## 📁 Spring Boot Project Structure

```
backend/src/main/java/com/trusthire/
├── TrustHireApplication.java
├── config/           # SecurityConfig, CorsConfig, WebSocketConfig
├── controller/       # REST controllers
├── service/          # Business logic
├── repository/       # JPA repositories
├── entity/           # JPA entities (@Entity)
├── dto/              # Request/response records
├── security/         # JwtAuthFilter, JwtService, WorkerSecurity
├── integration/      # AiServiceClient, CloudinaryService
├── scheduler/        # DataRetentionScheduler
├── listener/         # WorkerRatedListener (ApplicationEvent)
└── util/             # EncryptionUtil, SanitizationUtil
```

## 🐳 Docker Quick Reference

```bash
# Local development
docker-compose up -d                    # Start all services
docker-compose logs -f backend          # View backend logs
docker-compose down                     # Stop all services

# Production build
docker build -t trusthire-backend ./backend
docker run -p 8080:8080 --env-file .env trusthire-backend
```

## 📊 Trust Score Components

| Component | Max Points | Key Factors |
|-----------|-----------|-------------|
| Verification | 30 | Aadhaar + face match = 30, phone only = 10 |
| Ratings | 35 | Average rating + review count |
| Stability | 25 | Completion rate + platform tenure |
| Penalties | -50 max | Absconding (-10 each), disputes (-5 each) |

## 🔗 WebSocket (STOMP) Quick Reference

**Connection**: `ws://api.trusthire.in/ws` (via SockJS)

| Destination | Type | Description |
|-------------|------|-------------|
| `/topic/availability` | Subscribe | Worker availability updates |
| `/topic/jobs/{city}` | Subscribe | New job broadcasts |
| `/user/queue/level` | Subscribe | Personal level-up alerts |
| `/app/availability.update` | Send | Update own availability |

## 🗄️ Database Quick Reference

**Engine**: **Neon DB** (Serverless PostgreSQL) + PostGIS extension  
**ORM**: Hibernate (via Spring Data JPA)  
**Migrations**: Flyway (auto-runs on startup)

Key tables: `users`, `workers`, `employers`, `jobs`, `ratings`, `skill_tests`, `refresh_tokens`, `audit_logs`

PostGIS query for worker search:
```sql
ST_DWithin(location::geography,
    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
    :radiusMeters)
```

---

**Quick Reference Version**: 2.0 (Spring Boot)  
**Last Updated**: February 2026
