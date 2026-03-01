# TrustHire System Architecture

## Overview

TrustHire implements a modern **microservices architecture** with **two independent React Progressive Web Apps (PWAs)** (one for employers and one for workers). The backend is composed of specialized microservices designed for scale, flexibility, and maintainability.

## 🌐 Dual-PWA Architecture

### **Two Independent Frontend Apps:**

1. **TrustHire for Employers** 💼
   - React PWA (Vite/Next.js)
   - Business owners find and hire workers
   - Clerk-based authentication with email verification
   - Employer verification tiers (Basic → Verified → Premium)
   - Worker search and job posting features

2. **TrustHire for Workers** 👷
   - React PWA (Vite/Next.js)
   - Service providers find jobs and build careers
   - Clerk-based authentication with email verification
   - Aadhaar verification integration
   - Level progression tracking (L1 → L4)
   - Skill tests and profile building

### **Microservices Backend Layer:**
- **Modular Services**: Separate microservices for Auth, Workers, Employers, Jobs, Ratings, and Verification.
- **Polyglot Strategy**: Core services in Spring Boot (Java), AI services in FastAPI (Python), and workflows in **Make** (formerly Integromat).
- **Communication**: REST APIs and Event-driven communication for cross-service updates.
- **Data Persistence**: Shared **Prisma Postgres** (serverless PostgreSQL) instance with service-specific schemas.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │  TrustHire for       │  │  TrustHire for       │       │
│  │  Employers 💼        │  │  Workers 👷          │       │
│  │  (React Native)      │  │  (React Native)      │       │
│  │                      │  │                      │       │
│  │  - Worker search     │  │  - Job discovery     │       │
│  │  - Job posting       │  │  - Level progress    │       │
│  │  - Hire management   │  │  - Profile mgmt      │       │
│  │  - Rating workers    │  │  - Verification      │       │
│  │  - Google Sign-In    │  │  - Google Sign-In    │       │
│  └──────────┬───────────┘  └──────────┬───────────┘       │
│             │                         │                    │
└─────────────┼─────────────────────────┼────────────────────┘
              │                         │
              │    Google OAuth 2.0     │
              │    HTTPS/WSS            │
              │                         │
              ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│              SHARED BACKEND API (Single Instance)           │
│              Spring Boot 3.2 (Java 21)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Service (Spring Security)             │  │
│  │  - Google OAuth 2.0 integration                       │  │
│  │  - JWT token generation (jjwt)                        │  │
│  │  - Role-based routing (OWNER/WORKER/ADMIN)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │  Employer API    │  │  Worker API                   │   │
│  │  - Business mgmt │  │  - Profile management         │   │
│  │  - Job posting   │  │  - Job applications           │   │
│  │  - Worker search │  │  - Level calculation          │   │
│  │  - Hiring        │  │  - Verification               │   │
│  └──────────────────┘  └──────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Shared Services                                      │  │
│  │  - WebSocket Server (Spring WebSocket + STOMP)        │  │
│  │  - Level Calculation Engine                           │  │
│  │  - Skill Test Management                              │  │
│  │  - RBAC Enforcement (Spring Security)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
      │              │              │              │
      │              │              │              │
      ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│PostgreSQL│  │Cloudinary│  │WebSocket │  │  Google  │
│  + PostGIS│  │  Media   │  │  STOMP   │  │  OAuth   │
│  (AWS RDS)│  │          │  │Real-time │  │          │
│ - users  │  │ - Photos │  │ - Alerts │  │ - Auth   │
│ - workers│  │ - Videos │  │ - Updates│  │          │
│ -employers│ │ - Docs   │  │          │  │          │
│ - jobs   │  │          │  │          │  │          │
│ - ratings│  │          │  │          │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│              AI/ML MICROSERVICE                             │
│              FastAPI (Python) - Separate Service            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐       │
│  │ Trust Score  │  │ Level Score  │  │ Face Match │       │
│  │ Calculator   │  │ Calculator   │  │ (Aadhaar)  │       │
│  └──────────────┘  └──────────────┘  └────────────┘       │
│                                                             │
│  - Abscond Risk Prediction                                 │
│  - Fraud Detection                                         │
│  - Worker Recommendations                                  │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│              NOTIFICATION MICROSERVICE                      │
│              Firebase Cloud Messaging                       │
│                                                             │
│  - Job match notifications                                 │
│  - Level-up celebrations                                   │
│  - Skill test results                                      │
│  - Hire confirmations                                      │
└─────────────────────────────────────────────────────────────┘
```

---

### **Microservices Orchestration**

✅ **Distributed Backend Services**
-   **Auth Service**: Manages user identity via Clerk and role synchronization.
-   **Worker/Employer Services**: Manage domain-specific profile data.
-   **Job Service**: Handles the job lifecycle and matching logic.
-   **Notification Service**: Orchestrates alerts via Brevo (Email/SMS) and Clerk.

✅ **AI & Workflow Automation**
-   **Make (formerly Integromat) Workflow Engine**: Orchestrates complex AI tasks and business workflows.
-   **AI Service**: Specialized engines for scoring and fraud detection.

✅ **Separate Frontend Deliverables**
-   Independent React PWAs for Workers and Employers.
-   No shared frontend code; each app talks directly to respective services.
-   Optimized for mobile-first experience via browser.

❌ **NOT a monolithic backend**
-   Each module is an independent microservice.
-   Separated for independent scaling and maintenance.

### **How Role-Based Routing Works**

```java
// backend/src/main/java/com/trusthire/security/JwtAuthFilter.java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);
        if (token != null && jwtService.isTokenValid(token)) {
            String userId = jwtService.extractUserId(token);
            String role   = jwtService.extractRole(token); // WORKER, OWNER, ADMIN
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userId, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }
}

// backend/src/main/java/com/trusthire/config/SecurityConfig.java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/v1/workers/**").hasAnyRole("WORKER", "ADMIN")
        .requestMatchers("/api/v1/employers/**").hasAnyRole("OWNER", "ADMIN")
        .requestMatchers("/api/v1/jobs/**").authenticated()      // Both roles
        .requestMatchers("/api/v1/auth/**").permitAll()
    );
    return http.build();
}
```

## Design Principles

### 1. Modularity
Each component has clear, independent responsibilities:
-   **Mobile App**: User interface and experience
-   **Workflow**: Automated business logic orchestrated via **Make**.
-   **Backend API**: Business logic and orchestration (Spring Boot)
-   **Database**: Data persistence (Neon DB + PostGIS)
-   **AI Service**: Intelligence and analytics (FastAPI/Python)
-   **Media Storage**: Asset management (Cloudinary)
-   **Real-time Server**: Live updates (Spring WebSocket)

### 2. Scalability
- **Stateless Services**: Enable horizontal scaling
- **Database Sharding**: Neon DB (Serverless PostgreSQL)
- **CDN Distribution**: Cloudinary global edge network
- **Load Balancing**: Nginx reverse proxy / AWS ALB
- **Caching**: Redis for session and query caching (Spring Cache)

### 3. Separation of Concerns
- **AI Intelligence**: Separated from core business logic
- **Media Handling**: Offloaded to specialized service
- **Real-time**: Dedicated WebSocket server (STOMP)
- **Authentication**: Centralized Spring Security filter chain

### 4. Cloud-Native
- **Managed Services**: **Neon DB** (Serverless PostgreSQL), Cloudinary
- **Containerization**: Docker for backend & AI service
- **Auto-scaling**: Platform-managed (Railway, AWS ECS)
- **Monitoring**: Spring Actuator + AWS CloudWatch

## Component Details

### Web Applications (React PWAs)

**Technology**: React + Vite + TypeScript (or Next.js)

> **Development Workflow**: Standard web development. Use `npm run dev` for local development.

**Key Features**:
- **Progressive Web App**: Offline capabilities, installable on mobile devices.
- **Role-specific entry**: Separate URLs/domains for Workers and Employers.
- **Responsive UI**: Optimized for mobile and desktop browsers.

**Responsibilities**:
- User authentication via Clerk components.
- Profile management and onboarding.
- Real-time job/worker tracking.
- Media handling (Cloudinary upload widget/SDK).

**Responsibilities**:
- User authentication and onboarding
- Profile creation and management
- Worker/job discovery with level filters
- Real-time notifications
- Media capture (photos, skill test videos)
- Level progress tracking
- Skill test video recording

**State Management**:
- Context API for global state
- Local state for component-specific data
- AsyncStorage for persistence

### Backend API (Spring Boot)

**Technology**: Spring Boot 3.2+ with Java 21

**Key Dependencies** (`pom.xml`):
- `spring-boot-starter-web` - REST API framework
- `spring-boot-starter-data-jpa` - PostgreSQL ORM (Hibernate)
- `spring-boot-starter-security` - Authentication & authorization
- `spring-boot-starter-websocket` - WebSocket / STOMP server
- `spring-boot-starter-validation` - Bean validation
- `spring-boot-starter-data-redis` - Redis caching
- `jjwt-api` / `jjwt-impl` - JWT authentication
- `cloudinary-http44` - Cloudinary Java SDK
- `spring-boot-starter-actuator` - Health & metrics

**API Structure**:
```
/api/v1
  /auth
    POST /google-signin         (Google OAuth)
    POST /register              (email/password - optional)
    POST /login                 (email/password - optional)
    POST /refresh-token
    POST /logout
  /workers
    GET  /search               (location, level, skills)
    GET  /{id}
    PUT  /{id}
    PUT  /{id}/availability
    GET  /{id}/history
  /employers
    GET  /{id}
    PUT  /{id}
    POST /{id}/verify
    GET  /{id}/jobs
  /jobs
    POST /
    GET  /search
    GET  /{id}
    PUT  /{id}
    DELETE /{id}
  /ratings
    POST /
    GET  /worker/{workerId}
    GET  /employer/{employerId}
  /trust-scores
    GET  /worker/{workerId}
    POST /calculate
  /levels
    GET  /worker/{workerId}
    POST /calculate
    GET  /progress/{workerId}
  /skill-tests
    GET  /available
    POST /submit
    GET  /results/{submissionId}
  /verification
    POST /aadhaar
    POST /face-match
    GET  /status/{workerId}
  /media
    POST /upload-signature
```

**Middleware / Filter Stack**:
1. CORS configuration (`CorsConfiguration`)
2. Request logging (Logback + Slf4j)
3. Rate limiting (Bucket4j)
4. JWT authentication (`JwtAuthFilter`)
5. Role-based authorization (`@PreAuthorize`)
6. Bean validation (`@Valid`)
7. Global exception handling (`@ControllerAdvice`)

**Level Calculation Engine**:
```java
// com/trusthire/service/LevelCalculationService.java
@Service
public class LevelCalculationService {

    public LevelResult calculateLevelScore(UUID workerId) {
        double skillScore       = getSkillScore(workerId);
        double experienceScore  = getExperienceScore(workerId);
        double performanceScore = getPerformanceScore(workerId);
        double reliabilityScore = getReliabilityScore(workerId);

        double levelScore = (skillScore * 0.30)
                          + (experienceScore * 0.25)
                          + (performanceScore * 0.25)
                          + (reliabilityScore * 0.20);

        int level = mapScoreToLevel(levelScore);

        return new LevelResult(level, levelScore, skillScore,
                               experienceScore, performanceScore, reliabilityScore);
    }

    private int mapScoreToLevel(double score) {
        if (score >= 86) return 4;
        if (score >= 66) return 3;
        if (score >= 41) return 2;
        return 1;
    }
}
```

### Database (Neon DB - Serverless PostgreSQL)

**Tables Schema (JPA Entities)**:

**users**:
```java
@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = true)
    private String email;
    private String passwordHash; // optional - not needed for Google auth
    private String googleId;
    private String profilePhoto;
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider; // EMAIL | GOOGLE
    @Enumerated(EnumType.STRING)
    private Role role; // WORKER | OWNER | ADMIN
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**employers**:
```java
@Entity @Table(name = "employers")
public class Employer {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @OneToOne
    private User user;
    private String businessName;
    private String businessType;
    private String businessAddress;
    private String contactNumber;
    private String gstNumber;
    @Enumerated(EnumType.STRING)
    private VerificationTier verificationTier; // BASIC | VERIFIED | PREMIUM
    private Double rating;
    private Integer totalHires;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**workers**:
```java
@Entity @Table(name = "workers")
public class Worker {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @OneToOne
    private User user;
    private String name;
    private String phone;     // AES-256 encrypted
    private LocalDate dateOfBirth;
    private Integer age;
    @Column(columnDefinition = "geometry(Point,4326)") // PostGIS
    private Point location;
    @ElementCollection
    private List<String> skills;
    private Integer experience;
    private String profilePhoto; // Cloudinary URL
    private Integer trustScore;
    private Integer level;       // 1-4
    private Double levelScore;
    @Enumerated(EnumType.STRING)
    private Availability availability; // AVAILABLE | BUSY | UNAVAILABLE
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;
    private String aadhaarToken;  // SHA-256 hash
    private String aadhaarMasked; // XXXX-XXXX-XXXX
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**Indexes** (via `@Index` / Flyway migrations):
- `location` - PostGIS spatial index for geo queries (`ST_DWithin`)
- `level, trust_score` - Composite index for filtering
- `availability` - For quick availability searches
- `user_id` - For user-worker relationship

### AI Microservice (FastAPI)

**Technology**: Python 3.11 + FastAPI

**Key Libraries**:
- `fastapi` - Web framework
- `scikit-learn` - ML models
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `pydantic` - Data validation

**Endpoints**:
```
/api/ai/v1
  POST /trust-score/calculate
  POST /level-score/calculate
  POST /abscond-risk/predict
  POST /recommendations/workers
  POST /skill-video/analyze (future)
  POST /fraud/detect
```

**Model Architecture** (Future ML):
```python
# Trust Score ML Model
from sklearn.ensemble import GradientBoostingRegressor

features = [
    'verification_level',
    'avg_rating',
    'rating_count',
    'job_completion_rate',
    'avg_job_duration',
    'abscond_count',
    'dispute_count',
    'days_on_platform'
]

model = GradientBoostingRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5
)
```

### Media Storage (Cloudinary)

**Folder Structure**:
```
/trusthire
  /profile-photos
    /workers
    /employers
  /aadhaar-documents (private)
  /verification-selfies (private)
  /skill-test-videos
  /business-photos
  /achievement-badges
```

**Upload Flow**:
1. Mobile requests signed URL from Spring Boot backend
2. Backend generates signature using Cloudinary Java SDK
3. Mobile uploads directly to Cloudinary
4. Cloudinary returns asset URL
5. Backend stores URL in Neon DB

**Transformations**:
- Profile photos: `w_300,h_300,c_fill,q_80,f_auto`
- Skill videos: `q_auto,vc_h264`
- Aadhaar docs: `q_70,e_grayscale`

### Real-Time Communication (Spring WebSocket + STOMP)

**STOMP Destinations**:
- `/topic/availability` - Worker availability updates
- `/topic/jobs` - Job posting broadcasts
- `/topic/levels` - Level-up notifications
- `/queue/messages` - Private messaging (future)

**Events**:
```java
// Worker availability
messagingTemplate.convertAndSend("/topic/availability",
    new AvailabilityEvent(workerId, status));

// Job broadcasts
messagingTemplate.convertAndSend("/topic/jobs/" + city,
    new JobPostedEvent(job));

// Level updates (private)
messagingTemplate.convertAndSendToUser(workerId.toString(),
    "/queue/level", new LevelAchievedEvent(newLevel));
```

## Data Flow Examples

### Example 1: Worker Search Flow

```
1. Employer opens search screen
   ↓
2. Mobile sends GET /api/v1/workers/search
   - Query params: lat, lng, radius, minLevel, skills
   ↓
3. Spring Boot validates request (@Valid)
   ↓
4. WorkerRepository queries Neon DB with PostGIS geo query
   - ST_DWithin for location
   - Filter by level >= minLevel
   - Filter by skills (if specified)
   ↓
5. Backend sorts by trust_score DESC
   ↓
6. Backend returns worker list (paginated)
   ↓
7. Mobile displays results with level badges
```

### Example 2: Level Calculation Flow

```
1. Worker completes job and receives rating
   ↓
2. Backend updates rating in Neon DB
   ↓
3. Backend triggers level recalculation (ApplicationEvent)
   ↓
4. Backend calls AI service POST /level-score/calculate
   - Sends: skillScore, experienceScore, performanceScore, reliabilityScore
   ↓
5. AI service calculates weighted score
   ↓
6. AI service returns level assignment
   ↓
7. Backend updates worker level in Neon DB (JPA)
   ↓
8. If level increased:
   - Backend sends STOMP message /queue/level (WebSocket)
   - Backend sends FCM push notification (Firebase Admin SDK)
   ↓
9. Mobile receives notification
   ↓
10. Mobile shows celebration animation
```

### Example 3: Skill Test Submission Flow

```
1. Worker records skill test video
   ↓
2. Mobile requests upload signature
   - POST /api/v1/media/upload-signature
   ↓
3. Backend generates Cloudinary signed URL (Java SDK)
   ↓
4. Mobile uploads video directly to Cloudinary
   ↓
5. Cloudinary returns video URL
   ↓
6. Mobile submits test
   - POST /api/v1/skill-tests/submit
   - Body: { testId, videoUrl, workerId }
   ↓
7. Backend creates TestSubmission record (JPA)
   ↓
8. Admin reviews video (manual for now)
   ↓
9. Admin approves/rejects
   ↓
10. Backend updates skill score
    ↓
11. Backend recalculates level (LevelCalculationService)
    ↓
12. Backend sends push notification to worker
```

## Security Architecture

### Authentication Flow

```
1. User enters email + password (or Google Sign-In)
   ↓
2. Spring Security validates credentials
   ↓
3. Backend generates:
   - Access token (15 min expiry) via jjwt
   - Refresh token (30 day expiry)
   ↓
4. Mobile stores tokens in secure storage
   ↓
5. API requests include access token in header
   ↓
6. JwtAuthFilter validates token on each request
   ↓
7. If expired, use refresh token to get new access token
```

### Authorization Layers

1.  **Route-level**: Spring Security filter chain checks authentication
2.  **Role-level**: `@PreAuthorize("hasRole('WORKER')")` annotations
3.  **Resource-level**: Service layer checks if user owns resource
4.  **Field-level**: DTOs/projections filter data based on role

### Data Protection

- **At Rest**: AES-256 encryption for sensitive fields (Java Crypto)
- **In Transit**: TLS 1.3 for all communications (enforced by Spring Security)
- **In Use**: Encrypted memory for sensitive operations

## Scalability Strategy

### Horizontal Scaling

**Backend**:
- Stateless Spring Boot design enables multiple instances
- AWS ALB or Nginx distributes requests
- Session data in Redis (Spring Session)

**Database**:
# Neon DB Configuration
spring.datasource.url=${POSTGRES_URL}
- HikariCP connection pooling (built into Spring Boot)

**AI Service**:
- Containerized for easy replication
- Auto-scaling based on CPU/memory

### Vertical Scaling

**Backend**: t3.medium → t3.large → t3.xlarge
**Database**: db.t3.medium → db.t3.large → db.r5.large
**AI Service**: 512MB → 1GB → 2GB containers

### Caching Strategy

**Redis Layers** (Spring Cache + @Cacheable):
- Session cache (15 min TTL)
- API response cache (5 min TTL)
- Worker search results (2 min TTL)
- Trust score cache (1 hour TTL)

## Monitoring & Observability

### Metrics to Track

**Application** (Spring Actuator + Micrometer):
- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate (%)
- Active users

**Business**:
- New worker registrations
- Jobs posted
- Hires completed
- Level distribution
- Average trust scores

**Infrastructure** (AWS CloudWatch):
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth

### Logging

**Levels** (Logback):
- ERROR: System failures
- WARN: Potential issues
- INFO: Important events
- DEBUG: Detailed information

**Centralized Logging**:
- All services log to stdout / CloudWatch Logs
- Platform aggregates logs
- Searchable and filterable

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         PRODUCTION                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Backend    │  │   Backend    │  │   Backend    │     │
│  │  Instance 1  │  │  Instance 2  │  │  Instance 3  │     │
│  │ (Spring Boot)│  │ (Spring Boot)│  │ (Spring Boot)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                         │                                  │
│                  ┌──────────────┐                          │
│                  │ Load Balancer│                          │
│                  │  (Nginx/ALB) │                          │
│                  └──────────────┘                          │
│                         │                                  │
│                         │                                  │
│  ┌──────────────────────┴──────────────────────┐          │
│  │                                              │          │
│  ▼                                              ▼          │
│  PostgreSQL (AWS RDS)                     Cloudinary       │
│  Multi-AZ + Read Replicas                 (Global CDN)     │
│                                                            │
│  ┌──────────────┐                                         │
│  │  AI Service  │                                         │
│  │  (Fly.io /   │                                         │
│  │   Railway)   │                                         │
│  └──────────────┘                                         │
└─────────────────────────────────────────────────────────────┘
```

## Technology Choices Rationale

### Why React Native?
- ✅ Single codebase for iOS and Android
- ✅ Native performance
- ✅ Large ecosystem
- ✅ Fast development
- ✅ Cost-effective

### Why Spring Boot?
- ✅ Production-grade, enterprise-proven framework
- ✅ Rich ecosystem (Security, Data JPA, WebSocket, Cache)
- ✅ Strong type safety with Java 21
- ✅ Excellent PostgreSQL integration via Spring Data JPA
- ✅ Built-in dependency injection and AOP
- ✅ Active community and long-term support

### Why PostgreSQL + PostGIS?
- ✅ ACID compliance for transactional integrity
- ✅ Native geo-spatial queries via PostGIS (`ST_DWithin`)
- ✅ JSON/JSONB support for flexible schemas
- ✅ Excellent JPA/Hibernate mapping
- ✅ AWS RDS managed offering

### Why FastAPI for AI?
- ✅ Python ML ecosystem
- ✅ High performance
- ✅ Auto documentation
- ✅ Type safety
- ✅ Easy deployment

### Why Cloudinary?
- ✅ Automatic optimization
- ✅ Global CDN
- ✅ Transformations
- ✅ Secure uploads
- ✅ No server storage

## Future Architecture Enhancements

### Phase 1 (Current)
- Monolithic Spring Boot backend
- Rule-based AI
- Manual skill test review

### Phase 2 (6-12 months)
- Microservices separation (Spring Cloud)
- ML-enhanced scoring
- Redis caching layer

### Phase 3 (12+ months)
- Event-driven architecture (Spring Kafka)
- Real-time ML inference
- Multi-region deployment
- GraphQL API layer (Spring GraphQL)
