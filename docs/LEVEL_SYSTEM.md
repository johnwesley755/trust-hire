The TrustHire Level System (L1-L4) is a dynamic scoring engine orchestrated by **n8n** and managed within the **Worker Service**. It assigns workers to hierarchical levels based on their skills, experience, performance, and reliability. This defines transparent salary bands and motivates high standards.

**Think of it like**: Uber driver tiers, Swiggy gold partners, or gaming achievement systems – but for the informal workforce!

## 🏆 The Four Levels

| Level | Badge | Name | Trust Score | Salary Range |
|-------|-------|------|-------------|--------------|
| **L1** | 🌱 | Beginner | 0-40 | ₹8,000 - ₹12,000 |
| **L2** | ⚡ | Skilled | 41-65 | ₹12,000 - ₹18,000 |
| **L3** | 🌟 | Pro Worker | 66-85 | ₹18,000 - ₹25,000 |
| **L4** | 👑 | Elite | 86-100 | ₹25,000+ |

---

## 📊 Level Score Formula

```
Level Score = (Skill Score × 30%) + (Experience Score × 25%) + (Performance Score × 25%) + (Reliability Score × 20%)
```

All component scores are on a 0-100 scale before weighting.

---

## 🔢 Component Score Calculations

### Implementation in Spring Boot

```java
// com/trusthire/service/LevelCalculationService.java
@Service
@Transactional(readOnly = true)
public class LevelCalculationService {

    public LevelResult calculateLevel(UUID workerId) {
        double skillScore       = calculateSkillScore(workerId);
        double experienceScore  = calculateExperienceScore(workerId);
        double performanceScore = calculatePerformanceScore(workerId);
        double reliabilityScore = calculateReliabilityScore(workerId);

        double levelScore = (skillScore * 0.30)
                          + (experienceScore * 0.25)
                          + (performanceScore * 0.25)
                          + (reliabilityScore * 0.20);

        Level previousLevel = workerRepository.findLevelById(workerId);
        int newLevel = assignLevel(levelScore);

        return LevelResult.builder()
            .level(newLevel)
            .levelScore(levelScore)
            .skillScore(skillScore)
            .experienceScore(experienceScore)
            .performanceScore(performanceScore)
            .reliabilityScore(reliabilityScore)
            .levelChanged(newLevel != previousLevel.getNumber())
            .build();
    }

    // ── Skill Score (max 100) ────────────────────────────────────────────────
    private double calculateSkillScore(UUID workerId) {
        double baseScore = 30.0;

        // Skill test bonus (up to +35)
        List<SkillTest> passedTests = skillTestRepository.findPassedByWorkerId(workerId);
        double testBonus = passedTests.stream()
            .mapToDouble(t -> t.getScore() / 100.0 * 35.0)
            .average().orElse(0.0);

        // Skill variety bonus (up to +35)
        int skillCount = workerRepository.countSkillsById(workerId);
        double varietyBonus = Math.min(skillCount / 5.0, 1.0) * 35.0;

        return Math.min(100, baseScore + testBonus + varietyBonus);
    }

    // ── Experience Score (max 100) ───────────────────────────────────────────
    private double calculateExperienceScore(UUID workerId) {
        Worker worker = workerRepository.findById(workerId).orElseThrow();

        // Total jobs completed (up to +50)
        double jobScore = Math.min(worker.getTotalJobs() / 100.0, 1.0) * 50.0;

        // Months of experience (up to +50)
        double expScore = Math.min(worker.getExperience() / 24.0, 1.0) * 50.0;

        return Math.min(100, jobScore + expScore);
    }

    // ── Performance Score (max 100) ──────────────────────────────────────────
    private double calculatePerformanceScore(UUID workerId) {
        Worker worker = workerRepository.findById(workerId).orElseThrow();

        // Average rating (up to +70)
        double ratingScore = (worker.getAverageRating() / 5.0) * 70.0;

        // Rating count bonus (up to +30)
        double countBonus = Math.min(worker.getRatingCount() / 50.0, 1.0) * 30.0;

        return Math.min(100, ratingScore + countBonus);
    }

    // ── Reliability Score (max 100) ──────────────────────────────────────────
    private double calculateReliabilityScore(UUID workerId) {
        Worker worker = workerRepository.findById(workerId).orElseThrow();

        // Completion rate (up to +60)
        double completionScore = worker.getCompletionRate() / 100.0 * 60.0;

        // Days on platform (stability bonus, up to +40)
        double stabilityScore = Math.min(worker.getDaysOnPlatform() / 180.0, 1.0) * 40.0;

        // Abscond penalty
        double penalty = worker.getAbscondCount() * 20.0;

        return Math.max(0, Math.min(100, completionScore + stabilityScore - penalty));
    }

    private int assignLevel(double score) {
        if (score >= 86) return 4; // Elite
        if (score >= 66) return 3; // Pro Worker
        if (score >= 41) return 2; // Skilled
        return 1;                  // Beginner
    }
}
```

---

## 🗄️ Database Schema (JPA Entity)

```java
// com/trusthire/entity/Worker.java
@Entity
@Table(name = "workers")
public class Worker {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "level")
    private int level = 1;                   // 1-4

    @Column(name = "level_score", precision = 5, scale = 2)
    private double levelScore = 0.0;         // 0.00-100.00

    @Column(name = "skill_score")
    private double skillScore;
    @Column(name = "experience_score")
    private double experienceScore;
    @Column(name = "performance_score")
    private double performanceScore;
    @Column(name = "reliability_score")
    private double reliabilityScore;

    @Column(name = "trust_score")
    private int trustScore = 0;              // 0-100

    @Column(name = "total_jobs")
    private int totalJobs = 0;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private double averageRating = 0.0;

    @Column(name = "rating_count")
    private int ratingCount = 0;

    @Column(name = "completion_rate", precision = 5, scale = 2)
    private double completionRate = 100.0;   // percentage

    @Column(name = "abscond_count")
    private int abscondCount = 0;

    @Column(name = "days_on_platform")
    private int daysOnPlatform = 0;
}
```

---

## 🏅 Level Requirements

### 🌱 Level 1 - Beginner
**Entry Requirements**: Just download the app!
- Basic profile completed
- Phone number verified
- Profile photo uploaded

**Trust Score**: 0-40
**Salary Range**: ₹8,000 - ₹12,000/month
**Badge**: 🌱 Green leaf badge

---

### ⚡ Level 2 - Skilled
**Requirements**:
- [ ] Aadhaar verification completed
- [ ] 3-5 jobs completed with ratings
- [ ] Average rating ≥ 3.5
- [ ] 100% job completion rate
- [ ] Active for ≥ 30 days

**Trust Score**: 41-65
**Salary Range**: ₹12,000 - ₹18,000/month
**Badge**: ⚡ Electric bolt badge

---

### 🌟 Level 3 - Pro Worker
**Requirements**:
- [ ] Aadhaar + face verification completed
- [ ] 10+ jobs completed
- [ ] Average rating ≥ 4.0
- [ ] Active for ≥ 6 months
- [ ] Zero abscond incidents
- [ ] At least 1 skill test passed

**Trust Score**: 66-85
**Salary Range**: ₹18,000 - ₹25,000/month
**Badge**: 🌟 Gold star badge

---

### 👑 Level 4 - Elite
**Requirements**:
- [ ] Level 3 requirements met
- [ ] 30+ jobs completed
- [ ] Average rating ≥ 4.5
- [ ] Active for ≥ 12 months
- [ ] 100% completion rate (last 3 months)
- [ ] Advanced skill test passed (≥ 80% score)

**Trust Score**: 86-100
**Salary Range**: ₹25,000+/month
**Badge**: 👑 Crown badge

---

## 📈 Level Score Examples

### Example 1: Fresh Worker (L1)

| Component | Raw Score | Weight | Contribution |
|-----------|-----------|--------|--------------|
| Skill | 30 (no tests) | 30% | 9.0 |
| Experience | 10 (1 job) | 25% | 2.5 |
| Performance | 60 (3.0 avg) | 25% | 15.0 |
| Reliability | 80 (100% completion) | 20% | 16.0 |
| **Level Score** | | | **42.5 (→ L2 barely)** |

### Example 2: Pro Worker (L3)

| Component | Raw Score | Weight | Contribution |
|-----------|-----------|--------|--------------|
| Skill | 85 (1 test passed) | 30% | 25.5 |
| Experience | 75 (10 jobs, 8 months) | 25% | 18.75 |
| Performance | 90 (4.5 avg, 25 ratings) | 25% | 22.5 |
| Reliability | 90 (100%, 8 months) | 20% | 18.0 |
| **Level Score** | | | **84.75 (→ L3)** |

---

## ⚡ Level Calculation Trigger

Level is recalculated after every relevant event:

```java
// com/trusthire/service/RatingService.java
@Service
public class RatingService {

    public Rating saveRating(RatingRequest request) {
        Rating rating = ratingRepository.save(Rating.from(request));

        // Trigger async level recalculation
        applicationEventPublisher.publishEvent(
            new WorkerRatedEvent(request.getWorkerId()));

        return rating;
    }
}

// com/trusthire/listener/WorkerRatedListener.java
@Component
@Slf4j
public class WorkerRatedListener {

    @EventListener
    @Async
    public void onWorkerRated(WorkerRatedEvent event) {
        LevelResult result = levelCalculationService.calculateLevel(event.getWorkerId());
        workerRepository.updateLevelData(event.getWorkerId(), result);

        if (result.isLevelChanged()) {
            log.info("Worker {} leveled up to L{}", event.getWorkerId(), result.getLevel());
            notificationService.sendLevelUpNotification(event.getWorkerId(), result.getLevel());
            wsMessagingTemplate.convertAndSendToUser(
                event.getWorkerId().toString(),
                "/queue/level",
                new LevelChangedEvent(result.getLevel()));
        }
    }
}
```

**Triggered by**:
- New rating received → `WorkerRatedEvent`
- Skill test completed → `SkillTestCompletedEvent`
- Verification status updated → `VerificationUpdatedEvent`
- Job completed → `JobCompletedEvent`

---

## 🎮 Gamification Elements

### Progress Bar

```typescript
// LevelProgressBar.tsx
const LevelProgressBar = ({ worker }) => {
  const levelRanges = { 1:[0,40], 2:[41,65], 3:[66,85], 4:[86,100] };
  const [min, max] = levelRanges[worker.level];
  const progress = ((worker.levelScore - min) / (max - min)) * 100;

  return (
    <View style={styles.container}>
      <Text>Level {worker.level} → {worker.level + 1}</Text>
      <ProgressBar progress={Math.min(progress, 100)} />
      <Text>{Math.round(progress)}% to next level</Text>
    </View>
  );
};
```

### Achievement System

| Achievement | Requirement | Points |
|-------------|-------------|--------|
| ✅ First Job | Complete 1 job | +5 |
| ⭐ First 5-Star | Receive 5-star rating | +10 |
| 🛡️ Verified | Complete Aadhaar verification | +15 |
| 🔟 10 Jobs | Complete 10 jobs | +20 |
| 🎯 Skill Certified | Pass skill test | +25 |
| 💯 Reliability | 100% completion rate | +30 |

---

## 🔌 Level System API Endpoints

```http
# Get level details
GET /api/v1/levels/worker/{workerId}

# Get level progress  
GET /api/v1/levels/progress/{workerId}

# Trigger manual recalculation (admin only)
POST /api/v1/levels/recalculate/{workerId}
```

**Response example**:
```json
{
  "level": 3,
  "levelScore": 84.75,
  "components": {
    "skillScore": 85,
    "experienceScore": 75,
    "performanceScore": 90,
    "reliabilityScore": 90
  },
  "nextLevel": 4,
  "pointsToNextLevel": 1.25,
  "salaryRange": "₹18k - ₹25k",
  "levelChangedAt": "2024-01-15T10:30:00Z",
  "achievements": [
    "100 Jobs Completed",
    "Perfect Reliability",
    "Cooking Certified"
  ]
}
```

---

**Level System Version**: 2.0 (Spring Boot)  
**Last Updated**: February 2026
