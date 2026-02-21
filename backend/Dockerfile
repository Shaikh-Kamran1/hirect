# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/job-portal-1.0.0.jar .
EXPOSE 8080
CMD ["java", "-jar", "job-portal-1.0.0.jar"]
