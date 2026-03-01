# TrustHire API Documentation

## 🌐 Base URL

```
Production:  https://api.trusthire.in/api/v1
Development: http://localhost:8080/api/v1
```

## 📱 Dual-App Architecture

TrustHire uses a distributed microservices backend. Each service exposes its own set of REST endpoints. 

## 🔑 Authentication (Clerk)

All protected endpoints require a Clerk JWT token. Authentication is managed via Clerk's frontend components and backend SDKs.

```http
Authorization: Bearer <clerk_jwt_token>
```

### Authentication Flow
1. User signs in via Clerk PWA components.
2. Clerk provides a session token (JWT).
3. The PWA includes this token in the header of all requests to backends.
4. Each microservice validates the token using Clerk's public keys.

---

## 📝 API Endpoints

## 📝 Microservices Endpoints

### Auth Service
Manages Clerk users, role synchronization, and profile metadata.

- `POST /auth/sync`: Syncs Clerk user data into local service DB.
- `GET /auth/profile`: Gets combined user and role-specific metadata.

---

### Workers

#### Search Workers

```http
GET /workers/search
```

**Query Parameters**:
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `radius` (required): Search radius in kilometers (1-50)
- `minLevel` (optional): Minimum worker level (1-4)
- `skills` (optional): Comma-separated skills
- `availability` (optional): AVAILABLE|BUSY|UNAVAILABLE

**Example**:
```http
GET /workers/search?latitude=12.9716&longitude=77.5946&radius=5&minLevel=2&skills=cook,helper
```

**Response** (200 OK):
```json
{
  "workers": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ramesh Kumar",
      "profilePhoto": "https://res.cloudinary.com/...",
      "level": 3,
      "trustScore": 84,
      "skills": ["cook", "helper"],
      "experience": 10,
      "rating": 4.6,
      "distance": 2.3,
      "availability": "AVAILABLE",
      "salaryRange": "₹18k - ₹25k",
      "verificationStatus": "VERIFIED"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

#### Get Worker Details

```http
GET /workers/{id}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ramesh Kumar",
  "profilePhoto": "https://res.cloudinary.com/...",
  "age": 28,
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "skills": ["cook", "helper", "cleaning"],
  "experience": 10,
  "level": 3,
  "levelScore": 83.5,
  "trustScore": 84,
  "rating": 4.6,
  "totalJobs": 45,
  "completionRate": 100,
  "repeatHireRate": 85,
  "availability": "AVAILABLE",
  "salaryRange": "₹18k - ₹25k",
  "verificationStatus": "VERIFIED",
  "skillTests": [
    {
      "testName": "Cooking Skill Test",
      "score": 92,
      "passedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "workHistory": [
    {
      "employerName": "Cafe Coffee Day",
      "role": "Cook",
      "duration": "3 months",
      "rating": 5.0,
      "startDate": "2023-10-01",
      "endDate": "2023-12-31"
    }
  ]
}
```

#### Update Worker Profile

```http
PUT /workers/{id}
```

**Request Body**:
```json
{
  "name": "Ramesh Kumar",
  "age": 28,
  "skills": ["cook", "helper"],
  "experience": 10,
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Response** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "worker": { }
}
```

#### Update Availability

```http
PUT /workers/{id}/availability
```

**Request Body**:
```json
{
  "availability": "AVAILABLE"
}
```

**Response** (200 OK):
```json
{
  "message": "Availability updated",
  "availability": "AVAILABLE"
}
```

---

### Jobs

#### Create Job Posting

```http
POST /jobs
```

**Request Body**:
```json
{
  "title": "Senior Cook Needed",
  "description": "Looking for experienced cook for restaurant",
  "skills": ["cook"],
  "minLevel": 3,
  "salary": 22000,
  "duration": "3 months",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "schedule": "Full-time, 9 AM - 6 PM",
  "urgent": false
}
```

**Response** (201 Created):
```json
{
  "job": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Senior Cook Needed",
    "description": "Looking for experienced cook for restaurant",
    "skills": ["cook"],
    "minLevel": 3,
    "salary": 22000,
    "status": "OPEN",
    "postedBy": "550e8400-e29b-41d4-a716-446655440002",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Search Jobs

```http
GET /jobs/search
```

**Query Parameters**:
- `latitude` (required): Worker's latitude
- `longitude` (required): Worker's longitude
- `maxDistance` (optional): Maximum distance in km
- `skills` (optional): Comma-separated skills
- `minSalary` (optional): Minimum salary
- `status` (optional): OPEN|FILLED|CANCELLED

**Response** (200 OK):
```json
{
  "jobs": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Senior Cook Needed",
      "employerName": "Cafe Coffee Day",
      "salary": 22000,
      "minLevel": 3,
      "distance": 2.1,
      "postedAt": "2024-01-15T10:30:00Z",
      "urgent": false
    }
  ],
  "total": 8,
  "page": 1
}
```

---

### Ratings

#### Rate Worker

```http
POST /ratings
```

**Request Body**:
```json
{
  "workerId": "550e8400-e29b-41d4-a716-446655440000",
  "jobId": "660e8400-e29b-41d4-a716-446655440001",
  "ratings": {
    "reliability": 5,
    "quality": 5,
    "behavior": 5,
    "punctuality": 5
  },
  "overall": 5.0,
  "comment": "Excellent work, very professional"
}
```

**Response** (201 Created):
```json
{
  "rating": {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "workerId": "550e8400-e29b-41d4-a716-446655440000",
    "overall": 5.0,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "newTrustScore": 86,
  "newLevel": 4
}
```

---

### Trust Scores

#### Get Trust Score

```http
GET /trust-scores/worker/{workerId}
```

**Response** (200 OK):
```json
{
  "workerId": "550e8400-e29b-41d4-a716-446655440000",
  "trustScore": 84,
  "components": {
    "verification": 25,
    "ratings": 26,
    "stability": 23,
    "penalties": 0
  },
  "trend": "improving",
  "lastCalculated": "2024-01-15T10:30:00Z"
}
```

---

### Levels

#### Get Level Details

```http
GET /levels/worker/{workerId}
```

**Response** (200 OK):
```json
{
  "workerId": "550e8400-e29b-41d4-a716-446655440000",
  "currentLevel": 3,
  "levelScore": 83.5,
  "components": {
    "skillScore": 70,
    "experienceScore": 80,
    "performanceScore": 90,
    "reliabilityScore": 100
  },
  "nextLevel": 4,
  "pointsToNextLevel": 2.5,
  "salaryRange": "₹18k - ₹25k",
  "achievements": [
    "100 Jobs Completed",
    "Perfect Reliability",
    "Cooking Certified"
  ]
}
```

#### Get Level Progress

```http
GET /levels/progress/{workerId}
```

**Response** (200 OK):
```json
{
  "currentLevel": 3,
  "levelScore": 83.5,
  "nextLevel": 4,
  "progress": 96.5,
  "recommendations": [
    "Complete 1 more job",
    "Pass advanced skill test",
    "Maintain 4.5+ rating for 30 days"
  ],
  "estimatedTime": "2-3 weeks"
}
```

---

### Skill Tests

#### Get Available Tests

```http
GET /skill-tests/available
```

**Response** (200 OK):
```json
{
  "tests": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440004",
      "name": "Cooking Skill Test",
      "type": "VIDEO",
      "duration": 10,
      "passingScore": 70,
      "fee": 100,
      "impact": "+35 Skill Score points",
      "requirements": [
        "Prepare assigned dish",
        "Show full process",
        "5-10 minute video"
      ]
    }
  ]
}
```

#### Submit Skill Test

```http
POST /skill-tests/submit
```

**Request Body**:
```json
{
  "testId": "880e8400-e29b-41d4-a716-446655440004",
  "workerId": "550e8400-e29b-41d4-a716-446655440000",
  "videoUrl": "https://res.cloudinary.com/...",
  "answers": {}
}
```

**Response** (201 Created):
```json
{
  "submission": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "testId": "880e8400-e29b-41d4-a716-446655440004",
    "workerId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING",
    "submittedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Test submitted successfully. Results within 72 hours."
}
```

---

### Verification

#### Submit Aadhaar Verification

```http
POST /verification/aadhaar
```

**Request Body**:
```json
{
  "workerId": "550e8400-e29b-41d4-a716-446655440000",
  "aadhaarNumber": "1234-5678-9012",
  "documentUrl": "https://res.cloudinary.com/..."
}
```

**Response** (200 OK):
```json
{
  "message": "Aadhaar verification initiated",
  "verificationId": "aa0e8400-e29b-41d4-a716-446655440006",
  "status": "PENDING"
}
```

#### Submit Face Match

```http
POST /verification/face-match
```

**Request Body**:
```json
{
  "workerId": "550e8400-e29b-41d4-a716-446655440000",
  "selfieUrl": "https://res.cloudinary.com/..."
}
```

**Response** (200 OK):
```json
{
  "message": "Face match successful",
  "confidence": 92.5,
  "verified": true,
  "newTrustScore": 65
}
```

---

### Media

#### Get Upload Signature

```http
POST /media/upload-signature
```

**Request Body**:
```json
{
  "folder": "profile-photos",
  "publicId": "worker_550e8400"
}
```

**Response** (200 OK):
```json
{
  "signature": "a1b2c3d4e5f6...",
  "timestamp": 1642521600,
  "apiKey": "123456789012345",
  "cloudName": "your-cloud-name"
}
```

---

## 🔌 WebSocket Events (STOMP over SockJS)

### Connection

```javascript
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const client = new Client({
  webSocketFactory: () => new SockJS('https://api.trusthire.in/ws'),
  connectHeaders: {
    Authorization: `Bearer ${accessToken}`
  }
});
client.activate();
```

### Events

#### Availability Updates

**Send**:
```javascript
client.publish({
  destination: '/app/availability.update',
  body: JSON.stringify({
    workerId: '550e8400-e29b-41d4-a716-446655440000',
    status: 'AVAILABLE'
  })
});
```

**Subscribe**:
```javascript
client.subscribe('/topic/availability', (frame) => {
  const data = JSON.parse(frame.body);
  console.log(`Worker ${data.workerId} is now ${data.status}`);
});
```

#### Job Broadcasts

**Send** (Employer):
```javascript
client.publish({
  destination: '/app/jobs.post',
  body: JSON.stringify({ job: jobObject, radius: 5 })
});
```

**Subscribe** (Worker):
```javascript
client.subscribe('/topic/jobs/bengaluru', (frame) => {
  const job = JSON.parse(frame.body);
  console.log('New job posted:', job);
});
```

#### Level Updates

**Subscribe** (per-user queue):
```javascript
client.subscribe('/user/queue/level', (frame) => {
  const data = JSON.parse(frame.body);
  console.log(`Congratulations! You reached Level ${data.newLevel}`);
});
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## 🔧 Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

---

## 📝 Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests / 15 minutes |
| Authentication | 5 requests / 15 minutes |
| Search | 30 requests / minute |
| File Upload | 10 uploads / hour |

Rate limiting is enforced using **Bucket4j** on the Spring Boot backend.

---

## 🧪 Testing

### Using cURL

```bash
# Login
curl -X POST https://api.trusthire.in/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"worker@example.com","password":"SecurePass123!"}'

# Search workers
curl -X GET "https://api.trusthire.in/api/v1/workers/search?latitude=12.9716&longitude=77.5946&radius=5" \
  -H "Authorization: Bearer <access_token>"
```

### Using Postman

1. Import collection from `/docs/postman_collection.json`
2. Set environment variables:
   - `base_url`: https://api.trusthire.in/api/v1
   - `access_token`: Your JWT token
3. Run requests

---

**API Version**: v1  
**Backend**: Spring Boot 3.2 (Java 21)  
**Last Updated**: February 2026
