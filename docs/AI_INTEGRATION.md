# TrustHire AI Integration Guide

## 🤖 Overview

TrustHire uses AI as a decision-support layer to enhance trust assessment, predict reliability, improve matching efficiency, and power the level system. This guide covers the AI architecture, models, and integration points.

## 🏗️ AI Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Microservices Backend Layer              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Auth Service │  │Worker Service│  │ Job Service  │       │
│  │ (Clerk Auth) │  │(JPA/Postgres)│  │(JPA/Postgres)│       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │               │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    n8n Workflow Engine                      │
│              (AI Process Orchestration)                     │
│                                                             │
│  - Triggers AI scoring on new reviews                       │
│  - Manages multi-step Aadhaar verification workflows        │
│  - Routes data to specialized AI microservices              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Specialized AI Services                    │
│                    (FastAPI / Python)                       │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────────────────┐     │
│  │  Trust Score     │  │  Level Score                 │     │
│  │  Engine          │  │  Engine                      │     │
│  └──────────────────┘  └──────────────────────────────┘     │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────────────────┐     │
│  │  Fraud Engine    │  │  Risk Predictor              │     │
│  └──────────────────┘  └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 AI Use Cases

### 1. Trust Score Calculation

**Purpose**: Calculate a 0-100 reliability score for each worker

**Input Features**:
- Verification level (0-3)
- Average rating (0-5)
- Number of ratings
- Job completion rate (%)
- Average job duration (days)
- Abscond count
- Dispute count
- Days on platform

**Formula** (Phase 1 - Rule-based, implemented in Spring Boot):

```java
// com/trusthire/service/TrustScoreService.java
@Service
public class TrustScoreService {

    public int calculateTrustScore(UUID workerId) {
        Worker worker = workerRepository.findById(workerId)
            .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        int score = 0;

        // Verification Score (max 30 points)
        score += calculateVerificationScore(worker);

        // Rating Score (max 35 points)
        score += calculateRatingScore(worker);

        // Stability Score (max 25 points)
        score += calculateStabilityScore(worker);

        // Penalty Score (reduces score)
        score -= calculatePenalties(worker);

        return Math.max(0, Math.min(100, score));
    }

    private int calculateVerificationScore(Worker worker) {
        return switch (worker.getVerificationStatus()) {
            case FULLY_VERIFIED -> 30;    // Aadhaar + face match
            case AADHAAR_ONLY   -> 20;    // Aadhaar only
            case PHONE_ONLY     -> 10;    // Phone only
            case UNVERIFIED     -> 0;
        };
    }

    private int calculateRatingScore(Worker worker) {
        if (worker.getRatingCount() == 0) return 0;
        double normalizedRating = (worker.getAverageRating() / 5.0) * 35;
        double countBonus = Math.min(worker.getRatingCount() / 20.0, 1.0) * 5;
        return (int) Math.min(35, normalizedRating + countBonus);
    }

    private int calculateStabilityScore(Worker worker) {
        double completionScore = worker.getCompletionRate() / 100.0 * 15;
        double daysScore = Math.min(worker.getDaysOnPlatform() / 180.0, 1.0) * 10;
        return (int) (completionScore + daysScore);
    }

    private int calculatePenalties(Worker worker) {
        return (worker.getAbscondCount() * 10) + (worker.getDisputeCount() * 5);
    }
}
```

**Phase 2 - ML Model** (6+ months):
```python
# ai-service/models/trust_score.py
from sklearn.ensemble import GradientBoostingRegressor

FEATURES = [
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
    max_depth=5,
    random_state=42
)
```

---

### 2. Level Score Calculation

**Purpose**: Assign workers to levels 1-4 based on weighted component scores

**Level Assignment Formula** (Spring Boot `LevelCalculationService`):

```java
// com/trusthire/service/LevelCalculationService.java
@Service
public class LevelCalculationService {

    public LevelResult calculateLevel(UUID workerId) {
        double skillScore       = calculateSkillScore(workerId);
        double experienceScore  = calculateExperienceScore(workerId);
        double performanceScore = calculatePerformanceScore(workerId);
        double reliabilityScore = calculateReliabilityScore(workerId);

        // Weighted formula
        double levelScore = (skillScore * 0.30)
                          + (experienceScore * 0.25)
                          + (performanceScore * 0.25)
                          + (reliabilityScore * 0.20);

        int level = assignLevel(levelScore);

        return new LevelResult(level, levelScore,
            skillScore, experienceScore, performanceScore, reliabilityScore);
    }

    private int assignLevel(double score) {
        if (score >= 86) return 4; // Elite
        if (score >= 66) return 3; // Pro
        if (score >= 41) return 2; // Skilled
        return 1;                  // Beginner
    }

    private double calculateSkillScore(UUID workerId) {
        List<SkillTest> tests = skillTestRepository.findPassedByWorkerId(workerId);
        if (tests.isEmpty()) return 30.0;

        double baseScore = 30.0;
        double testBonus = tests.stream()
            .mapToDouble(t -> t.getScore() / 100.0 * 35.0)
            .average().orElse(0.0);
        List<String> skills = workerRepository.findSkillsById(workerId);
        double skillVariety = Math.min(skills.size() / 5.0, 1.0) * 35.0;

        return Math.min(100, baseScore + testBonus + skillVariety);
    }
}
```

**Level → Salary Mapping**:
```java
public enum Level {
    L1(1, "Beginner",   "₹8k - ₹12k",  0,  40),
    L2(2, "Skilled",    "₹12k - ₹18k", 41, 65),
    L3(3, "Pro Worker", "₹18k - ₹25k", 66, 85),
    L4(4, "Elite",      "₹25k+",       86, 100);

    final int number;
    final String label;
    final String salaryRange;
    final int minScore;
    final int maxScore;
}
```

---

### 3. Abscond Risk Prediction

**Purpose**: Predict the probability a worker will abscond from an assignment

**FastAPI Endpoint**:
```python
# ai-service/routers/abscond_risk.py
@router.post("/abscond-risk/predict")
async def predict_abscond_risk(request: AbscondRiskRequest) -> AbscondRiskResponse:
    features = np.array([[
        request.trust_score,
        request.level,
        request.completion_rate,
        request.avg_job_duration,
        request.abscond_count,
        request.days_since_last_job,
        request.distance_to_job
    ]])
    probability = model.predict_proba(features)[0][1]  # P(abscond)
    risk_level  = classify_risk(probability)
    return AbscondRiskResponse(probability=probability, risk_level=risk_level)
```

**Spring Boot Integration**:
```java
// com/trusthire/integration/AiServiceClient.java
@Service
public class AiServiceClient {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;

    public AbscondRiskResponse predictAbscondRisk(UUID workerId) {
        Worker worker = workerRepository.findById(workerId).orElseThrow();
        AbscondRiskRequest request = AbscondRiskRequest.from(worker);

        try {
            return restTemplate.postForObject(
                aiServiceUrl + "/api/ai/v1/abscond-risk/predict",
                request, AbscondRiskResponse.class);
        } catch (ResourceAccessException e) {
            // Fallback to rule-based heuristic
            log.warn("AI service unavailable, using rule-based fallback");
            return fallbackAbscondRisk(worker);
        }
    }
}
```

---

### 4. Worker Recommendations

**Purpose**: Recommend the best workers for a job posting

**Algorithm** (rule-based Phase 1 → ML Phase 2):

```java
// com/trusthire/service/RecommendationService.java
@Service
public class RecommendationService {

    public List<WorkerScore> recommendWorkers(Job job) {
        List<Worker> candidates = workerRepository.searchNearby(
            job.getLatitude(), job.getLongitude(), 10.0, job.getMinLevel());

        return candidates.stream()
            .map(w -> new WorkerScore(w, calculateMatchScore(w, job)))
            .sorted(Comparator.comparingDouble(WorkerScore::score).reversed())
            .limit(20)
            .toList();
    }

    private double calculateMatchScore(Worker worker, Job job) {
        double skillMatch    = calculateSkillMatch(worker.getSkills(), job.getSkills()) * 0.40;
        double levelMatch    = (double) worker.getLevel() / 4.0 * 0.30;
        double trustScore    = worker.getTrustScore() / 100.0 * 0.20;
        double availability  = worker.getAvailability() == AVAILABLE ? 0.10 : 0.0;
        return skillMatch + levelMatch + trustScore + availability;
    }
}
```

---

### 5. Face Matching (Aadhaar Verification)

**Purpose**: Verify worker identity by matching face in Aadhaar document to live selfie

**FastAPI Endpoint**:
```python
# ai-service/routers/face_match.py
from deepface import DeepFace

@router.post("/face-match/verify")
async def verify_face_match(
    aadhaar_url: str,
    selfie_url: str
) -> FaceMatchResponse:
    try:
        # Download images
        aadhaar_img = download_image(aadhaar_url)
        selfie_img  = download_image(selfie_url)

        # Extract face from Aadhaar
        aadhaar_face = extract_face_region(aadhaar_img)

        # Compare faces
        result = DeepFace.verify(
            img1_path=aadhaar_face,
            img2_path=selfie_img,
            model_name="Facenet512",
            distance_metric="cosine"
        )

        confidence = (1 - result["distance"]) * 100
        verified   = confidence >= 85.0

        return FaceMatchResponse(
            verified=verified,
            confidence=confidence,
            match_score=result["distance"]
        )
    finally:
        # Always clean up biometric data
        delete_temp_images(aadhaar_img, selfie_img)
```

**Spring Boot Integration**:
```java
// com/trusthire/service/VerificationService.java
@Service
public class VerificationService {

    public FaceMatchResult verifyFace(UUID workerId, String selfieUrl) {
        Worker worker = workerRepository.findById(workerId).orElseThrow();

        FaceMatchResponse aiResult = aiServiceClient.verifyFace(
            worker.getAadhaarDocument(), selfieUrl);

        if (aiResult.isVerified()) {
            worker.setVerificationStatus(VerificationStatus.FULLY_VERIFIED);
            workerRepository.save(worker);

            // Recalculate trust score now that fully verified
            trustScoreService.recalculate(workerId);
        }

        return new FaceMatchResult(aiResult.isVerified(), aiResult.getConfidence());
    }
}
```

---

### 6. Fraud Detection

**Purpose**: Detect fake profiles and fraudulent activity patterns

**FastAPI Fraud Detection**:
```python
# ai-service/routers/fraud.py
@router.post("/fraud/detect")
async def detect_fraud(request: FraudDetectionRequest) -> FraudDetectionResponse:
    risk_factors = []

    # Check for duplicate Aadhaar
    if await is_duplicate_aadhaar(request.aadhaar_token):
        risk_factors.append("DUPLICATE_AADHAAR")

    # Check for impossible rapid location changes
    if await detect_geo_impossibility(request.user_id, request.location):
        risk_factors.append("GEO_IMPOSSIBILITY")

    # Check bot-like behavior patterns
    if detect_bot_patterns(request.activity_timeline):
        risk_factors.append("BOT_BEHAVIOR")

    risk_level = determine_risk_level(risk_factors)
    return FraudDetectionResponse(
        risk_level=risk_level, risk_factors=risk_factors)
```

---

### 7. Workflow Orchestration (n8n)

**Purpose**: n8n acts as the central orchestrator for complex, multi-step AI processes that involve multiple services.

**Key Workflows**:
- **Verification Pipeline**: Triggered when a worker uploads Aadhaar. n8n coordinates between the Verification Service, AI Face Match Engine, and Worker Service.
- **Dynamic Scoring**: Triggered by new ratings. n8n fetches historical data from Worker/Job services, calls the AI Scoring Engine, and pushes updates back to the Worker Service.
- **Fraud Monitoring**: scheduled checks that aggregate data across services to identify anomalous behavior.

---

## 📡 AI Service API Reference

**Base URL**: `http://ai-service:8000/api/ai/v1` (internal)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/trust-score/calculate` | POST | Calculate trust score |
| `/level-score/calculate` | POST | Calculate level score |
| `/abscond-risk/predict` | POST | Predict abscond risk |
| `/recommendations/workers` | POST | Recommend workers for job |
| `/face-match/verify` | POST | Aadhaar face matching |
| `/fraud/detect` | POST | Fraud detection |

---

## 🔄 AI Integration in Spring Boot

### Async AI Processing

```java
// com/trusthire/service/AsyncAiService.java
@Service
public class AsyncAiService {

    @Async("aiExecutor")
    public CompletableFuture<Void> recalculateScoresAsync(UUID workerId) {
        try {
            int newTrustScore = trustScoreService.calculateTrustScore(workerId);
            LevelResult levelResult = levelCalculationService.calculateLevel(workerId);

            workerRepository.updateScores(workerId,
                newTrustScore, levelResult.level(), levelResult.levelScore());

            // Notify worker if level changed
            if (levelResult.levelChanged()) {
                notificationService.sendLevelUpNotification(workerId, levelResult.level());
            }
        } catch (Exception e) {
            log.error("Score recalculation failed for worker {}", workerId, e);
        }
        return CompletableFuture.completedFuture(null);
    }
}

// Triggered after each rating
@Service
public class RatingService {
    public Rating addRating(RatingRequest request) {
        Rating rating = ratingRepository.save(Rating.from(request));
        asyncAiService.recalculateScoresAsync(request.getWorkerId()); // non-blocking
        return rating;
    }
}
```

### AI Service Health Check

```java
// com/trusthire/integration/AiServiceHealthIndicator.java
@Component
public class AiServiceHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                aiServiceUrl + "/health", String.class);
            return response.getStatusCode().is2xxSuccessful()
                ? Health.up().withDetail("ai-service", "UP").build()
                : Health.down().withDetail("ai-service", "DEGRADED").build();
        } catch (Exception e) {
            return Health.down().withDetail("ai-service", "DOWN")
                .withException(e).build();
        }
    }
}
```

---

## 📊 AI Decision Transparency

### Trust Score Explanation

```json
{
  "trustScore": 84,
  "explanation": {
    "verificationScore": {
      "score": 30,
      "max": 30,
      "reason": "Fully verified (Aadhaar + face match)"
    },
    "ratingScore": {
      "score": 32,
      "max": 35,
      "reason": "Average rating 4.6/5.0 over 45 jobs"
    },
    "stabilityScore": {
      "score": 22,
      "max": 25,
      "reason": "100% completion rate, 8 months on platform"
    },
    "penalties": {
      "deduction": 0,
      "reason": "No absconding or disputes"
    }
  }
}
```

---

## 🔮 Future AI Roadmap

### Phase 1 (Current)
- Rule-based trust scoring (Spring Boot `TrustScoreService`)
- Formula-based level calculation
- Basic fraud detection
- Face matching via FastAPI

### Phase 2 (6-12 months)
- ML-enhanced trust scoring (Gradient Boosting)
- Predictive abscond risk model
- Smart worker-job matching (collaborative filtering)

### Phase 3 (12+ months)
- Skill video analysis (CNN / YOLO)
- Real-time fraud detection (streaming)
- Predictive salary negotiation
- Behavioral biometrics

---

**AI Integration Version**: 2.0 (Spring Boot)  
**Last Updated**: February 2026
