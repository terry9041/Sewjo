# Use a base image with OpenJDK 17
FROM openjdk:17-jdk-alpine
RUN mkdir -p /sewjo-server
WORKDIR /sewjo-server
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENV CLIENT_URL http://localhost:3000
CMD ["java", "-jar", "app.jar"]