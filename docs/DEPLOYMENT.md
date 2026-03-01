# TrustHire Deployment Guide

TrustHire uses a distributed deployment model. The two frontend PWAs are deployed independently, and the backend consists of multiple microservices running in Docker containers.

## 🏗️ Deployment Overview

### **Frontends (React PWAs):**
- **Worker PWA**: Deployed via Vercel/Netlify or Docker.
- **Employer PWA**: Deployed via Vercel/Netlify or Docker.

### **Backend (Microservices):**
- **Core Services**: Spring Boot services (Auth, Worker, Employer, Job, etc.).
- **AI Services**: FastAPI Python services.
- [x] **Make Orchestration**: Independent workflows for verification and scoring.

### **Database:**
- **Postgres**: Single RDS instance with service-specific schemas.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Java 21+ installed locally (for local builds)
- [ ] Maven 3.9+ installed locally
- [ ] **Neon DB** account (Serverless PostgreSQL)
- [ ] Cloudinary account created
- [ ] Domain name (optional but recommended)
### Step 4: Configure Workflows (Make)
Workflows are hosted on **Make.com**. Ensure the following webhooks are configured to trigger the Verification and Scoring processes.
- [ ] SSL certificate (Let's Encrypt or platform-provided)
- [ ] Git repository set up
- [ ] Environment variables documented

## 🗂️ Project Structure

```
trust-hire/
├── frontends/
│   ├── employer-pwa/           # React PWA for Employers
│   └── worker-pwa/             # React PWA for Workers
├── services/
│   ├── auth-service/           # Clerk & Auth logic
│   ├── worker-service/         # Worker profiles & levels
│   ├── employer-service/       # Employer profiles
│   ├── job-service/            # Job lifecycle
│   └── ...                     # Other microservices
├── ai-engines/                 # AI microservices
│   ├── scoring-engine/
│   └── workflow-engine/        # n8n
└── docs/                       # Documentation
```

---

## 📱 PWA Deployment

The React PWAs are built as static sites and can be served by any web server (Nginx) or specialized hosting provider like Vercel or Netlify.

### Build Commands
```bash
# In frontends/worker-pwa or frontends/employer-pwa directory
npm install
npm run build
```

### Environment Variables (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=https://api.trusthire.in
```

## ⚙️ Environment Configuration

### Spring Boot (`application-prod.properties`)

```properties
# Server
server.port=8080
spring.profiles.active=prod

# Neon DB Configuration
spring.datasource.url=${POSTGRES_URL}
spring.datasource.driver-class-name=org.postgresql.Driver

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Flyway (DB migrations)
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# JWT
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=900000       # 15 minutes
app.jwt.refresh-expiration-ms=2592000000  # 30 days

# Encryption
app.encryption.key=${ENCRYPTION_KEY}  # 32-byte hex

# Google OAuth
google.oauth.client-id=${GOOGLE_CLIENT_ID}

# Cloudinary
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}

# Firebase FCM
firebase.service-account-path=${FIREBASE_SERVICE_ACCOUNT_PATH}

# AI Service
ai.service.url=${AI_SERVICE_URL}   # e.g. http://ai-service:8000

# Redis
spring.data.redis.host=${REDIS_HOST}
spring.data.redis.port=6379
spring.data.redis.password=${REDIS_PASSWORD}

# Logging
logging.level.com.trusthire=INFO
logging.level.org.springframework.security=WARN
```

### Required Secrets

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `CLERK_SECRET_KEY` | Clerk backend secret key | `sk_test_...` |
| `CLERK_JWT_KEY` | Clerk PEM public key | `-----BEGIN PUBLIC KEY-----...` |
| `BREVO_API_KEY` | Brevo transaction email key | `xkeysib-xxxx...` |
| `CLOUDINARY_URL` | Cloudinary API URL | `cloudinary://key:secret@name` |
| `N8N_API_KEY` | Key for n8n orchestration | `n8n_api_...` |

---

## 🐳 Docker Deployment (Recommended)

### Dockerfile (Spring Boot)

```dockerfile
# backend/Dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Copy the built JAR
COPY target/trusthire-backend-*.jar app.jar

# Create non-root user
RUN addgroup -S trusthire && adduser -S trusthire -G trusthire
USER trusthire

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
```

### Multi-stage Build

```dockerfile
# backend/Dockerfile.multistage
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/target/trusthire-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

### docker-compose.yml (Local Dev)

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.multistage
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - DB_HOST=postgres
      - DB_NAME=trusthire_dev
      - DB_USERNAME=trusthire
      - DB_PASSWORD=devpassword
      - JWT_SECRET=dev-secret-32-chars-minimum-here!
      - ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgis/postgis:15-3.3-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: trusthire_dev
      POSTGRES_USER: trusthire
      POSTGRES_PASSWORD: devpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U trusthire"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=development

volumes:
  postgres_data:
```

---

## ☁️ Option 1: Railway (Easiest)

Railway is the recommended platform for quick deployment.

### Step 1: Prepare Application

```bash
# Build JAR locally first to verify it compiles
cd backend
mvn clean package -DskipTests
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your repository
4. Select the `backend/` directory as root

### Step 3: Add PostgreSQL + Redis

1. In Railway dashboard, click "+ New" → "Database" → "PostgreSQL"
2. Click "+ New" → "Database" → "Redis"
3. Railway auto-connects internal URLs

### Step 4: Configure Environment Variables

In Railway → Variables tab, add all secrets from the table above.

```bash
# Railway also provides these automatically:
RAILWAY_ENVIRONMENT=production
PORT=8080
```

### Step 5: Add Build Command

In Railway service settings:
```
Build Command: mvn clean package -DskipTests -B
Start Command: java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -jar target/trusthire-backend-*.jar
```

### Step 6: Deploy

Railway auto-deploys on every `git push` to main branch.

---

## ☁️ Option 2: AWS EC2 + RDS

For production-grade, scalable deployment.

### Step 1: Provision Neon DB (PostgreSQL)

```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier trusthire-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username trusthire_user \
  --master-user-password "YourStrongPassword" \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-name trusthire_prod \
  --multi-az \
  --region ap-south-1
```

### Step 2: Install PostGIS Extension

```sql
-- After connecting to RDS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```

### Step 3: Launch EC2 Instance

```bash
# EC2 User Data script (Amazon Linux 2023)
#!/bin/bash
yum update -y
yum install -y java-21-amazon-corretto

# Create app directory
mkdir -p /opt/trusthire
cd /opt/trusthire

# Copy JAR (from S3 or direct)
aws s3 cp s3://trusthire-artifacts/trusthire-backend.jar app.jar

# Create systemd service
cat > /etc/systemd/system/trusthire.service << 'EOF'
[Unit]
Description=TrustHire Spring Boot Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/trusthire
ExecStart=/usr/bin/java \
  -XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=75.0 \
  -Dspring.profiles.active=prod \
  -jar /opt/trusthire/app.jar
EnvironmentFile=/opt/trusthire/.env
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable trusthire
systemctl start trusthire
```

### Step 4: Nginx Reverse Proxy

```nginx
# /etc/nginx/conf.d/trusthire.conf
server {
    listen 80;
    server_name api.trusthire.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.trusthire.in;

    ssl_certificate     /etc/letsencrypt/live/api.trusthire.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.trusthire.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass         http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

### Step 5: SSL Certificate

```bash
# Install Certbot
yum install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d api.trusthire.in

# Auto-renew
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

## 🤖 AI Service Deployment (FastAPI)

```dockerfile
# ai-service/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deploy to Railway/Fly.io**:
```bash
fly deploy --app trusthire-ai
```

---

## 📊 Health Checks & Monitoring

### Spring Actuator Endpoints

```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=never
management.metrics.export.prometheus.enabled=true
```

```http
# Health check
GET https://api.trusthire.in/actuator/health
→ { "status": "UP" }
```

### Application Monitoring

```bash
# Check service status (EC2)
systemctl status trusthire

# View logs
journalctl -u trusthire -f --since "1 hour ago"

# Restart service
systemctl restart trusthire
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Java 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Maven dependencies
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}

      - name: Build JAR
        run: mvn clean package -DskipTests -B
        working-directory: ./backend

      - name: Build Docker image
        run: docker build -t trusthire-backend ./backend

      - name: Push to ECR
        run: |
          aws ecr get-login-password --region ap-south-1 | \
            docker login --username AWS --password-stdin $ECR_REGISTRY
          docker tag trusthire-backend $ECR_REGISTRY/trusthire-backend:latest
          docker push $ECR_REGISTRY/trusthire-backend:latest

      - name: Deploy to EC2
        run: |
          ssh ec2-user@${{ secrets.EC2_HOST }} \
            "systemctl restart trusthire"
```

---

## 📦 Database Migrations (Flyway)

Flyway automatically runs on application startup:

```
backend/src/main/resources/db/migration/
  V1__create_users_table.sql
  V2__create_workers_table.sql
  V3__add_postgis_extension.sql
  V4__create_jobs_table.sql
  V5__create_ratings_table.sql
  V6__add_indexes.sql
```

Example migration:
```sql
-- V3__add_postgis_extension.sql
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE workers
  ALTER COLUMN location TYPE geometry(Point,4326)
    USING ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);

CREATE INDEX idx_workers_location ON workers USING GIST(location);
CREATE INDEX idx_workers_level_trust ON workers(level, trust_score DESC);
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| `DataSourceException: Connection refused` | Check DB_HOST, security groups allow port 5432 |
| `JWT expired / invalid` | Check JWT_SECRET matches between restarts |
| `403 Forbidden on all requests` | Check Spring Security config, CORS origin list |
| `Flyway migration failed` | Check SQL syntax, ensure PostGIS is installed |
| `Cloudinary upload fails` | Verify API key/secret, check folder permissions |
| Service won't start | Check `journalctl -u trusthire` for stack trace |
| Out of memory | Increase RAM, tune `-XX:MaxRAMPercentage` |

---

**Deployment Version**: 2.0 (Spring Boot)  
**Last Updated**: February 2026
