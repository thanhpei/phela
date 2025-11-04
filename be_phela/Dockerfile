# ----- STAGE 1: Build với JDK 22 -----
# Sử dụng một image có sẵn Maven và JDK 22 để build code
FROM maven:3.9-eclipse-temurin-22 AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy file pom.xml trước để tận dụng cache của Docker
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy toàn bộ source code còn lại
COPY src ./src

# Chạy lệnh build của Maven để tạo ra file .jar
RUN mvn clean package -DskipTests


# ----- STAGE 2: Run với JRE 22 -----
# Sử dụng một image JRE (Java Runtime Environment) 22 nhỏ gọn để chạy ứng dụng
# JRE nhỏ hơn JDK, an toàn hơn cho môi trường production
FROM openjdk:22-jdk-slim

# Tạo thư mục làm việc
WORKDIR /app

# Chỉ copy file .jar đã được build từ STAGE 1 vào image cuối cùng
COPY --from=builder /app/target/*.jar app.jar

# Mở cổng 8080 (hoặc cổng ứng dụng của bạn)
EXPOSE 8080

# Lệnh để khởi chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]