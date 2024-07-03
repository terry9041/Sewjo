# Use a base image with OpenJDK 17
FROM openjdk:17-jdk-alpine
COPY build/libs/*.jar app.jar
COPY .env .env
ENV CLIENT_URL http://localhost:3000
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
