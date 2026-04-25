# Stage 1: Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Set active profile to prod
ENV SPRING_PROFILES_ACTIVE=prod

# Render injects PORT env var. We don't strictly need EXPOSE but it's good practice.
# Note: The app will use ${PORT:8080} from application.yml
EXPOSE 8080

# Use -Djava.security.egd to prevent entropy-related hangs
# Use -Xmx to limit memory usage on smaller instances
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Xmx512m", "-jar", "app.jar"]
