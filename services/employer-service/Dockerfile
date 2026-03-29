# Build stage
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests -f services/pom.xml -pl employer-service -am

# Run stage
FROM eclipse-temurin:17-jre-focal
WORKDIR /app
COPY --from=build /app/services/employer-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
