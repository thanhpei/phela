# Sử dụng một base image có sẵn Java 17
FROM openjdk:17-jdk-slim

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file JAR đã được build vào thư mục làm việc trong container
COPY target/be_phela-0.0.1-SNAPSHOT.jar app.jar

# Cổng mà ứng dụng Spring Boot sẽ chạy
EXPOSE 8080

# Lệnh để chạy ứng dụng khi container khởi động
ENTRYPOINT ["java", "-jar", "app.jar"]